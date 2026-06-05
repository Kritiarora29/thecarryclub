export const AnalyticsEvents = {
  PAGE_VIEW:          "page_view",
  VIEW_CONTENT:       "view_content",
  ADD_TO_CART:        "add_to_cart",
  INITIATE_CHECKOUT:  "initiate_checkout",
  ADD_PAYMENT_INFO:   "add_payment_info",
  PURCHASE:           "purchase",
  LEAD:               "lead",
  SEARCH:             "search",
  API_ERROR:          "api_error",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
