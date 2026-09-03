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
        """Demo provider pricing changes the result from the mid-market rate."""

        rate_response = Mock(ok=True, status_code=200)
        rate_response.json.return_value = {
            "rates": {
                "EUR": 1.17,
            }
        }
        rate_response.raise_for_status.return_value = None

        with patch(
            "app.routes.conversions.requests.get",
            return_value=rate_response,
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
        self.assertEqual(result["fee"], 180.0)
        self.assertEqual(result["feePercent"], 0.8)
        self.assertEqual(result["markupPercent"], 0.8)
        self.assertEqual(result["amountAfterFee"], 9820.0)
        self.assertAlmostEqual(result["providerResult"], 11489.4, places=2)
        self.assertTrue(result["isMockPricing"])

    def test_demo_pricing_is_available_without_provider_quote(self):
        """Demo pricing remains available for the capstone comparison UI."""

        rate_response = Mock(ok=True, status_code=200)
        rate_response.json.return_value = {
            "rates": {
                "USD": 0.0077,
            }
        }
        rate_response.raise_for_status.return_value = None

        with patch(
            "app.routes.conversions.requests.get",
            return_value=rate_response,
        ):
            result = _build_comparison("KES", "USD", 10000, "Wise")

        self.assertTrue(result["isMockPricing"])
        self.assertEqual(result["fee"], 180.0)
        self.assertEqual(result["feePercent"], 0.8)

    def test_cash_pickup_uses_demo_pricing(self):
        """Cash pickup is included in the demo comparison pricing."""

        rate_response = Mock(ok=True, status_code=200)
        rate_response.json.return_value = {
            "rates": {
                "EUR": 1.17,
            }
        }
        rate_response.raise_for_status.return_value = None

        with patch(
            "app.routes.conversions.requests.get",
            return_value=rate_response,
        ):
            result = _build_comparison("GBP", "EUR", 10000, "Cash pickup")

        self.assertEqual(result["fee"], 500.0)
        self.assertEqual(result["feePercent"], 2.0)
        self.assertTrue(result["isMockPricing"])


if __name__ == "__main__":
    unittest.main()