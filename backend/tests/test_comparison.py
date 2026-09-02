import unittest
from unittest.mock import Mock, patch

from app.routes.conversions import _build_comparison, _select_provider_quote


class ComparisonTests(unittest.TestCase):
    """Tests for provider comparison and conversion calculations."""

    def test_selects_wise_provider(self):
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
        self.assertEqual(quote["received_amount"], 11555.84)

    def test_selects_bank_provider(self):
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

    def test_channel_changes_calculated_result(self):
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

        self.assertEqual(result["midMarketResult"], 11700)
        self.assertEqual(result["providerResult"], 11555.84)

        # Floating-point arithmetic can produce values such as
        # 144.15999999999985 instead of exactly 144.16.
        self.assertAlmostEqual(
            result["difference"],
            144.16,
            places=2,
        )

        self.assertEqual(result["channel"], "Wise")

    def test_cash_pickup_is_not_fabricated(self):
        with self.assertRaises(ValueError):
            _build_comparison(
                "GBP",
                "EUR",
                10000,
                "Cash pickup",
            )


if __name__ == "__main__":
    unittest.main()