import unittest
from unittest.mock import Mock, patch

from app.routes.conversions import _build_comparison, _select_provider_quote


class ComparisonTests(unittest.TestCase):
    """Tests for provider comparison and conversion calculations."""

    def test_selects_wise_provider(self):
        """Selects a Wise quote when Wise is returned by the provider API."""

        data = {
            "providers": [
                {
                    "id": 39,
                    "alias": "wise",
                    "name": "Wise",
                    "type": "moneyTransferProvider",
                    "quotes": [
                        {
                            "rate": 1.15989,
                            "fee": 37.12,
                            "markup": 0,
                            "receivedAmount": 11555.84,
                        }
                    ],
                }
            ]
        }

        quote = _select_provider_quote(data, "Wise")

        self.assertEqual(quote["provider_alias"], "wise")
        self.assertEqual(quote["provider_name"], "Wise")
        self.assertEqual(quote["received_amount"], 11555.84)
        self.assertEqual(quote["fee"], 37.12)

    def test_selects_bank_provider(self):
        """Selects a bank quote when a bank provider is returned."""

        data = {
            "providers": [
                {
                    "id": 1,
                    "alias": "barclays",
                    "name": "Barclays",
                    "type": "bank",
                    "quotes": [
                        {
                            "rate": 1.1279,
                            "fee": 0,
                            "markup": 2.75,
                            "receivedAmount": 11279.24,
                        }
                    ],
                }
            ]
        }

        quote = _select_provider_quote(data, "Bank")

        self.assertEqual(quote["provider_alias"], "barclays")
        self.assertEqual(quote["provider_name"], "Barclays")
        self.assertEqual(quote["received_amount"], 11279.24)
        self.assertEqual(quote["fee"], 0)

    def test_channel_changes_calculated_result(self):
        """A provider quote should produce a different result from mid-market."""

        provider_response = Mock(ok=True, status_code=200)
        provider_response.json.return_value = {
            "providers": [
                {
                    "id": 39,
                    "alias": "wise",
                    "name": "Wise",
                    "type": "moneyTransferProvider",
                    "quotes": [
                        {
                            "rate": 1.15989,
                            "fee": 37.12,
                            "markup": 0,
                            "receivedAmount": 11555.84,
                        }
                    ],
                }
            ]
        }

        rate_response = Mock(ok=True, status_code=200)
        rate_response.json.return_value = {
            "rates": {
                "EUR": 1.17,
            }
        }
        rate_response.raise_for_status.return_value = None

        with patch(
            "app.routes.conversions.requests.get",
            side_effect=[rate_response, provider_response],
        ):
            result = _build_comparison(
                "GBP",
                "EUR",
                10000,
                "Wise",
            )

        self.assertEqual(result["sourceCurrency"], "GBP")
        self.assertEqual(result["targetCurrency"], "EUR")
        self.assertEqual(result["amount"], 10000)
        self.assertEqual(result["channel"], "Wise")

        self.assertEqual(result["midMarketRate"], 1.17)
        self.assertEqual(result["midMarketResult"], 11700)
        self.assertEqual(result["providerRate"], 1.15989)
        self.assertEqual(result["providerResult"], 11555.84)
        self.assertEqual(result["fee"], 37.12)

        # Floating-point arithmetic can produce values such as
        # 144.15999999999985 instead of exactly 144.16.
        self.assertAlmostEqual(
            result["difference"],
            144.16,
            places=2,
        )

    def test_empty_provider_response_is_not_fabricated(self):
        """
        An empty provider response must not result in a fabricated quote.

        This protects the application from showing a provider-specific
        conversion when the upstream comparison API has no quote available.
        """

        provider_response = Mock(ok=True, status_code=200)
        provider_response.json.return_value = {
            "providers": [],
            "sourceCurrency": "KES",
            "targetCurrency": "USD",
            "amount": 10000,
        }

        rate_response = Mock(ok=True, status_code=200)
        rate_response.json.return_value = {
            "rates": {
                "USD": 0.0077,
            }
        }
        rate_response.raise_for_status.return_value = None

        with patch(
            "app.routes.conversions.requests.get",
            side_effect=[rate_response, provider_response],
        ):
            with self.assertRaises(LookupError):
                _build_comparison(
                    "KES",
                    "USD",
                    10000,
                    "Wise",
                )

    def test_cash_pickup_is_not_fabricated(self):
        """
        Cash pickup should not return a fake provider quote when the
        comparison API does not support that channel.
        """

        with self.assertRaises(ValueError):
            _build_comparison(
                "GBP",
                "EUR",
                10000,
                "Cash pickup",
            )


if __name__ == "__main__":
    unittest.main()