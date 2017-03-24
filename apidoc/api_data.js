define({ "api": [
  {
    "type": "put",
    "url": "/deals/:dealId/approve",
    "title": "Approve Daily Deal",
    "version": "0.1.0",
    "name": "ApproveDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "download_price",
            "description": "<p>Download Price</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "approved_category_id",
            "description": "<p>Approved Category Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"download_price\": 10,\n  \"approved_category_id\": 5 \n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if approve operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\" : true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "delete",
    "url": "/deals/:id",
    "title": "Delete Deal",
    "version": "0.1.0",
    "name": "DeleteDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Daily Deal Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if delete operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "put",
    "url": "/deals/:dealId/disapprove",
    "title": "Disapprove Daily Deal",
    "version": "0.1.0",
    "name": "DispproveDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if disapprove operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\" : true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/deals/advertisers/:advertiserId",
    "title": "Get Advertiser Deals",
    "version": "0.1.0",
    "name": "GetAdvertiserDeals",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "advertiserId",
            "description": "<p>Advertiser Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of Advertiser Daily Deals.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Pagination Page Number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "numRowsPerPage",
            "description": "<p>Pagination Number of Rows Per Page.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalPages",
            "description": "<p>Pagination Total Pages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": [\n\t\t    {\n\t\t      \"category_name\": \"Beauty and Spas\",\n\t\t      \"deal_id\": 146,\n\t\t      \"microsite_id\": 165,\n\t\t      \"company_name\": null,\n\t\t      \"what_you_get\": \"<ul>\\n\\t<li>50% off all perfumes</li>\\n\\t<li>Free Facial</li>\\n</ul>\\n\",\n\t\t      \"location\": \"10479 Brown Wolf St\",\n\t\t      \"end_date\": \"2017-03-29T21:00:00.000Z\",\n\t\t      \"start_date\": \"2017-03-07T21:00:00.000Z\",\n\t\t      \"discount_daily_description\": \"\",\n\t\t      \"discount_percentage\": 0,\n\t\t      \"discount_type\": \"text\",\n\t\t      \"name\": \"Discount Perfume\",\n\t\t      \"discount_price\": null,\n\t\t      \"budget_limit\": 1000,\n\t\t      \"budget_period\": \"weekly\",\n\t\t      \"image\": \"1488990852669459887.jpeg\",\n\t\t      \"image_1\": \"1488990913298512744.jpeg\",\n\t\t      \"image_2\": \"1488990917999789239.jpeg\",\n\t\t      \"code\": \"embeddable/html/code\",\n\t\t      \"date_created\": \"2017-03-08T16:36:45.000Z\",\n\t\t      \"download_price\": 6,\n\t\t      \"discount_description\": \"50% off all perfumes\",\n\t\t      \"regular_price\": 0,\n\t\t      \"discount_rate\": 0,\n\t\t      \"coupon_name\": \"Discount Perfume\",\n\t\t      \"coupon_generated_code\": \"j016qgqq\",\n\t\t      \"paused\": 0,\n\t\t      \"downloads\": 0,\n\t\t      \"available_fund\": 1000,\n\t\t      \"is_approved\": 1,\n\t\t      \"is_deleted\": 0,\n\t\t      \"list_rank\": 0,\n\t\t      \"deal_image\": \"image_name\",\n\t\t      \"daily_deal_description\": \"<p>Discount Perfumes at our following locations:</p>\\n\\n<ul>\\n\\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\\n\\t<li>817 S. Main St. Las Vegas NV 89101</li>\\n</ul>\\n\",\n\t\t      \"approved_category_id\": 3\n\t\t    }\n\t\t  ],\n\t\t  \"page\": 1,\n\t\t  \"numRowsPerPage\": 10,\n\t\t  \"totalRows\": 1,\n\t\t  \"totalPages\": 1\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/deals",
    "title": "Get All Deals",
    "version": "0.1.0",
    "name": "GetAllDeals",
    "group": "Daily_Deals",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of Daily Deals.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Pagination Page Number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "numRowsPerPage",
            "description": "<p>Pagination Number of Rows Per Page.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalPages",
            "description": "<p>Pagination Total Pages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": [\n\t\t    {\n\t\t      \"id\": 153,\n\t\t      \"image\": \"deal_image_name\",\n\t\t      \"name\": \"Deal name\",\n\t\t      \"budget_limit\": 100,\n\t\t      \"budget_period\": \"daily\",\n\t\t      \"paused\": 0,\n\t\t      \"downloads\": 0,\n\t\t      \"available_fund\": 100,\n\t\t      \"approved_category_id\": 6,\n\t\t      \"download_price\": 10,\n\t\t      \"date_created\": \"2017-03-23T21:23:10.000Z\",\n\t\t      \"is_approved\": 0\n\t\t    }\n\t\t  ],\n\t\t  \"page\": 1,\n\t\t  \"numRowsPerPage\": 10,\n\t\t  \"totalRows\": 1,\n\t\t  \"totalPages\": 1\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/deals/:dealId",
    "title": "Get Deal",
    "version": "0.1.0",
    "name": "GetDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "deal",
            "description": "<p>Daily Deal Information</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"category_name\": \"Home and Garden\",\n\t\t  \"deal_id\": 152,\n\t\t  \"microsite_id\": 172,\n\t\t  \"company_name\": \"company name\",\n\t\t  \"what_you_get\": \"what you get\",\n\t\t  \"location\": \"location\",\n\t\t  \"end_date\": \"2017-04-03T21:00:00.000Z\",\n\t\t  \"start_date\": \"2017-03-02T21:00:00.000Z\",\n\t\t  \"discount_daily_description\": \"discount description\",\n\t\t  \"discount_percentage\": 15,\n\t\t  \"discount_type\": \"numeric\",\n\t\t  \"name\": \"Deal name\",\n\t\t  \"discount_price\": null,\n\t\t  \"budget_limit\": 100,\n\t\t  \"coupon_image\": \"image_name\",\n\t\t  \"budget_period\": \"daily\",\n\t\t  \"advertiser_id\": 100,\n\t\t  \"paused\": 0,\n\t\t  \"image\": \"image_name\",\n\t\t  \"image_1\": \"image_1\",\n\t\t  \"image_2\": \"image_2\",\n\t\t  \"code\": \"CODE\",\n\t\t  \"date_created\": \"2017-03-23T21:17:06.000Z\",\n\t\t  \"download_price\": 10,\n\t\t  \"discount_description\": \"discount description\",\n\t\t  \"regular_price\": 50,\n\t\t  \"discount_rate\": null,\n\t\t  \"coupon_name\": \"coupon name\",\n\t\t  \"coupon_generated_code\": \"CODE\",\n\t\t  \"is_approved\": 0,\n\t\t  \"is_deleted\": 0,\n\t\t  \"list_rank\": 0,\n\t\t  \"deal_image\": \"deal_image_name\",\n\t\t  \"daily_deal_description\": \"daily deal description\",\n\t\t  \"lat\": \"-25.7394229\",\n\t\t  \"lng\": \"28.1758982\",\n\t\t  \"approved_category_id\": 6,\n\t\t  \"suggested_category_id\": 6,\n\t\t  \"city\": \"Las Vegas\",\n\t\t  \"state_id\": \"5\",\n\t\t  \"zip_code\": \"1234\",\n\t\t  \"usa_state_name\": \"California\"\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/deals/categories",
    "title": "Get Deal Categories",
    "version": "0.1.0",
    "name": "GetDealCategories",
    "group": "Daily_Deals",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "categories",
            "description": "<p>List of Deal Categories.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    [\n\t\t  {\n\t\t    \"category_id\": 1,\n\t\t    \"category_name\": \"Activities and Events\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 2,\n\t\t    \"category_name\": \"Automotive\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 3,\n\t\t    \"category_name\": \"Beauty and Spas\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 4,\n\t\t    \"category_name\": \"Food and Restaurants\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 5,\n\t\t    \"category_name\": \"Health and Fitness\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 6,\n\t\t    \"category_name\": \"Home and Garden\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 7,\n\t\t    \"category_name\": \"Home Services\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 8,\n\t\t    \"category_name\": \"Office Products and Services\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 9,\n\t\t    \"category_name\": \"Personal Services\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 10,\n\t\t    \"category_name\": \"Pets\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 11,\n\t\t    \"category_name\": \"Shopping\"\n\t\t  },\n\t\t  {\n\t\t    \"category_id\": 12,\n\t\t    \"category_name\": \"Travel\"\n\t\t  }\n\t\t]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/search/deals?limit=:limit",
    "title": "Get Deals from Each Category",
    "version": "0.1.0",
    "name": "GetDealsFromEachCategory",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Number of Deals From Each Category.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "deals",
            "description": "<p>List of Daily Deals From Each Category.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    [\n\t\t  {\n\t\t    \"deal_id\": 146,\n\t\t    \"microsite_id\": 165,\n\t\t    \"company_name\": null,\n\t\t    \"what_you_get\": \"<ul>\\n\\t<li>50% off all perfumes</li>\\n\\t<li>Free Facial</li>\\n</ul>\\n\",\n\t\t    \"location\": \"10479 Brown Wolf St\",\n\t\t    \"end_date\": \"2017-03-30T00:00:00.000Z\",\n\t\t    \"start_date\": \"2017-03-08T00:00:00.000Z\",\n\t\t    \"discount_daily_description\": \"\",\n\t\t    \"discount_percentage\": 0,\n\t\t    \"discount_type\": \"text\",\n\t\t    \"name\": \"Discount Perfume\",\n\t\t    \"discount_price\": null,\n\t\t    \"image\": \"image\",\n\t\t    \"image_1\": \"image\",\n\t\t    \"image_2\": \"image\",\n\t\t    \"code\": \"embeddable/code\",\n\t\t    \"date_created\": \"2017-03-08T16:36:45.000Z\",\n\t\t    \"download_price\": 6,\n\t\t    \"discount_description\": \"50% off all perfumes\",\n\t\t    \"regular_price\": 0,\n\t\t    \"discount_rate\": 0,\n\t\t    \"coupon_name\": \"Discount Perfume\",\n\t\t    \"coupon_generated_code\": \"j016qgqq\",\n\t\t    \"is_approved\": 1,\n\t\t    \"is_deleted\": 0,\n\t\t    \"list_rank\": 0,\n\t\t    \"deal_image\": \"\",\n\t\t    \"daily_deal_description\": \"<p>Discount Perfumes at our following locations:</p>\\n\\n<ul>\\n\\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\\n\\t<li>817 S. Main St. Las Vegas NV 89101</li>\\n</ul>\\n\",\n\t\t    \"approved_category_id\": 3,\n\t\t    \"url\": \"http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146\"\n\t\t  },\n\t\t  {\n\t\t    \"deal_id\": 151,\n\t\t    \"microsite_id\": 171,\n\t\t    \"company_name\": \"company name\",\n\t\t    \"what_you_get\": \"what you get\",\n\t\t    \"location\": \"location\",\n\t\t    \"end_date\": \"2017-04-04T00:00:00.000Z\",\n\t\t    \"start_date\": \"2017-03-03T00:00:00.000Z\",\n\t\t    \"discount_daily_description\": \"discount description\",\n\t\t    \"discount_percentage\": 15,\n\t\t    \"discount_type\": \"numeric\",\n\t\t    \"name\": \"Deal name\",\n\t\t    \"discount_price\": null,\n\t\t    \"image\": \"image_name\",\n\t\t    \"image_1\": \"image_1\",\n\t\t    \"image_2\": \"image_2\",\n\t\t    \"code\": \"CODE\",\n\t\t    \"date_created\": \"2017-03-23T21:15:30.000Z\",\n\t\t    \"download_price\": 20,\n\t\t    \"discount_description\": \"discount description\",\n\t\t    \"regular_price\": 50,\n\t\t    \"discount_rate\": null,\n\t\t    \"coupon_name\": \"coupon name\",\n\t\t    \"coupon_generated_code\": \"CODE\",\n\t\t    \"is_approved\": 1,\n\t\t    \"is_deleted\": 0,\n\t\t    \"list_rank\": 0,\n\t\t    \"deal_image\": \"deal_image_name\",\n\t\t    \"daily_deal_description\": \"daily deal description\",\n\t\t    \"approved_category_id\": 3,\n\t\t    \"url\": \"http://ppc.l/api/click/deals/151/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F151\"\n\t\t  }\n\t\t]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/click/deals/:dealId/:redirectUrl/:userId",
    "title": "Member Click Tracking of Daily Deals",
    "version": "0.1.0",
    "name": "MemberClickTrackingofDailyDeals",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/search/deals/:categoryId/:keyword/:userId",
    "title": "Member Search Deal By Category and Keyword",
    "version": "0.1.0",
    "name": "MemberSearchDealByCategoryAndKeyword",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "categoryId",
            "description": "<p>Daily Deal Category Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>Search Keyword.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of Daily Deals in a Category.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Pagination Page Number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "numRowsPerPage",
            "description": "<p>Pagination Number of Rows Per Page.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalPages",
            "description": "<p>Pagination Total Pages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": [\n\t\t    {\n\t\t      \"deal_id\": 146,\n\t\t      \"microsite_id\": 165,\n\t\t      \"company_name\": null,\n\t\t      \"what_you_get\": \"<ul>\\n\\t<li>50% off all perfumes</li>\\n\\t<li>Free Facial</li>\\n</ul>\\n\",\n\t\t      \"location\": \"10479 Brown Wolf St\",\n\t\t      \"end_date\": \"2017-03-29T21:00:00.000Z\",\n\t\t      \"start_date\": \"2017-03-07T21:00:00.000Z\",\n\t\t      \"discount_daily_description\": \"\",\n\t\t      \"discount_percentage\": 0,\n\t\t      \"discount_type\": \"text\",\n\t\t      \"name\": \"Discount Perfume\",\n\t\t      \"discount_price\": null,\n\t\t      \"image\": \"image_name\",\n\t\t      \"image_1\": \"image_name\",\n\t\t      \"image_2\": \"image_name\",\n\t\t      \"code\": \"embeddable_code\",\n\t\t      \"date_created\": \"2017-03-08T16:36:45.000Z\",\n\t\t      \"download_price\": 6,\n\t\t      \"discount_description\": \"50% off all perfumes\",\n\t\t      \"regular_price\": 0,\n\t\t      \"discount_rate\": 0,\n\t\t      \"coupon_name\": \"Discount Perfume\",\n\t\t      \"coupon_generated_code\": \"j016qgqq\",\n\t\t      \"is_approved\": 1,\n\t\t      \"is_deleted\": 0,\n\t\t      \"list_rank\": 0,\n\t\t      \"deal_image\": \"image_name\",\n\t\t      \"paused\": 0,\n\t\t      \"daily_deal_description\": \"<p>Discount Perfumes at our following locations:</p>\\n\\n<ul>\\n\\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\\n\\t<li>817 S. Main St. Las Vegas NV 89101</li>\\n</ul>\\n\",\n\t\t      \"approved_category_id\": 3,\n\t\t      \"url\": \"http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146\"\n\t\t    }\n\t\t  ],\n\t\t  \"page\": 1,\n\t\t  \"numRowsPerPage\": 10,\n\t\t  \"totalRows\": 2,\n\t\t  \"totalPages\": 1\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/search/deals/:categoryId/:keyword",
    "title": "Non-member Search Deal By Category and Keyword",
    "version": "0.1.0",
    "name": "NonMemberSearchDealByCategoryAndKeyword",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "categoryId",
            "description": "<p>Daily Deal Category Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>Search Keyword.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of Daily Deals in a Category.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Pagination Page Number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "numRowsPerPage",
            "description": "<p>Pagination Number of Rows Per Page.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalPages",
            "description": "<p>Pagination Total Pages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": [\n\t\t    {\n\t\t      \"deal_id\": 146,\n\t\t      \"microsite_id\": 165,\n\t\t      \"company_name\": null,\n\t\t      \"what_you_get\": \"<ul>\\n\\t<li>50% off all perfumes</li>\\n\\t<li>Free Facial</li>\\n</ul>\\n\",\n\t\t      \"location\": \"10479 Brown Wolf St\",\n\t\t      \"end_date\": \"2017-03-29T21:00:00.000Z\",\n\t\t      \"start_date\": \"2017-03-07T21:00:00.000Z\",\n\t\t      \"discount_daily_description\": \"\",\n\t\t      \"discount_percentage\": 0,\n\t\t      \"discount_type\": \"text\",\n\t\t      \"name\": \"Discount Perfume\",\n\t\t      \"discount_price\": null,\n\t\t      \"image\": \"image_name\",\n\t\t      \"image_1\": \"image_name\",\n\t\t      \"image_2\": \"image_name\",\n\t\t      \"code\": \"embeddable_code\",\n\t\t      \"date_created\": \"2017-03-08T16:36:45.000Z\",\n\t\t      \"download_price\": 6,\n\t\t      \"discount_description\": \"50% off all perfumes\",\n\t\t      \"regular_price\": 0,\n\t\t      \"discount_rate\": 0,\n\t\t      \"coupon_name\": \"Discount Perfume\",\n\t\t      \"coupon_generated_code\": \"j016qgqq\",\n\t\t      \"is_approved\": 1,\n\t\t      \"is_deleted\": 0,\n\t\t      \"list_rank\": 0,\n\t\t      \"deal_image\": \"image_name\",\n\t\t      \"paused\": 0,\n\t\t      \"daily_deal_description\": \"<p>Discount Perfumes at our following locations:</p>\\n\\n<ul>\\n\\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\\n\\t<li>817 S. Main St. Las Vegas NV 89101</li>\\n</ul>\\n\",\n\t\t      \"approved_category_id\": 3,\n\t\t      \"url\": \"http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146\"\n\t\t    }\n\t\t  ],\n\t\t  \"page\": 1,\n\t\t  \"numRowsPerPage\": 10,\n\t\t  \"totalRows\": 2,\n\t\t  \"totalPages\": 1\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/click/deals/:dealId/:redirectUrl",
    "title": "Non-Member Click Tracking of Daily Deals",
    "version": "0.1.0",
    "name": "Non_MemberClickTrackingofDailyDeals",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "put",
    "url": "/deals/:dealId/pause",
    "title": "Pause Daily Deal",
    "version": "0.1.0",
    "name": "PauseDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if pause operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\" : true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "post",
    "url": "/deals",
    "title": "Post Deal information",
    "version": "0.1.0",
    "name": "PostDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "daily_deal",
            "description": "<p>Daily Deal json data</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "daily_deal_microsite",
            "description": "<p>Daily Deal Microsite json data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "    {\n      \"daily_deal\": {\n      \t\"coupon_name\": \"coupon name\",\n\t\t  \t\"coupon_image\": \"image_name\",\n\t\t  \t\"deal_image\": \"deal_image_name\",\n\t\t  \t\"coupon_generated_code\": \"CODE\",\n\t\t  \t\"budget_limit\": \"100\",\n\t\t  \t\"budget_period\": \"daily\",\n\t\t  \t\"business_id\": \"3\",\n\t\t  \t\"advertiser_id\": \"100\",\n\t\t  \t\"start_date\": \"2017-03-03\",\n\t\t  \t\"end_date\": \"2017-04-04\",\n\t\t  \t\"regular_price\": \"50\",\n\t\t  \t\"download_price\": \"10\",\n\t\t  \t\"suggested_category_id\": \"6\",\n\t\t  \t\"discount_type\": \"numeric\"\n      },\n      \n      \"daily_deal_microsite\": {\n      \t\"name\": \"Deal name\",\n\t  \t\t\"business_name\": \"business name\",\n\t  \t\t\"image\": \"image_name\",\n\t  \t\t\"address_1\": \"address_1\",\n\t  \t\t\"address_2\": \"address_2\",\n\t  \t\t\"state_id\": \"5\",\n\t  \t\t\"city\": \"Las Vegas\",\n\t  \t\t\"zip_code\": \"1234\",\n\t  \t\t\"phone_number\": \"0023423423\",\n\t  \t\t\"company_name\": \"company name\",\n\t  \t\t\"daily_deal_description\": \"daily deal description\",\n\t  \t\t\"what_you_get\": \"what you get\",\n\t  \t\t\"image_1\": \"image_1\",\n\t  \t\t\"image_2\": \"image_2\",\n\t  \t\t\"code\": \"CODE\",\n\t  \t\t\"download_file\": \"file name\",\n\t  \t\t\"download_filename\": \"file title\",\n\t  \t\t\"discount_daily_description\": \"discount description\",\n\t  \t\t\"discount_description\": \"discount description\",\n\t  \t\t\"location\": \"location\",\n\t  \t\t\"discount_percentage\": \"15\"\n      }\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Id of created Deal.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\" : 153\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/search/deals/:categoryId",
    "title": "Search Deal By Category",
    "version": "0.1.0",
    "name": "SearchDealByCategory",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "categoryId",
            "description": "<p>Daily Deal Category Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of Daily Deals in a Category.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Pagination Page Number.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "numRowsPerPage",
            "description": "<p>Pagination Number of Rows Per Page.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "totalPages",
            "description": "<p>Pagination Total Pages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": [\n\t\t    {\n\t\t      \"deal_id\": 146,\n\t\t      \"microsite_id\": 165,\n\t\t      \"company_name\": null,\n\t\t      \"what_you_get\": \"<ul>\\n\\t<li>50% off all perfumes</li>\\n\\t<li>Free Facial</li>\\n</ul>\\n\",\n\t\t      \"location\": \"10479 Brown Wolf St\",\n\t\t      \"end_date\": \"2017-03-29T21:00:00.000Z\",\n\t\t      \"start_date\": \"2017-03-07T21:00:00.000Z\",\n\t\t      \"discount_daily_description\": \"\",\n\t\t      \"discount_percentage\": 0,\n\t\t      \"discount_type\": \"text\",\n\t\t      \"name\": \"Discount Perfume\",\n\t\t      \"discount_price\": null,\n\t\t      \"image\": \"image_name\",\n\t\t      \"image_1\": \"image_name\",\n\t\t      \"image_2\": \"image_name\",\n\t\t      \"code\": \"embeddable_code\",\n\t\t      \"date_created\": \"2017-03-08T16:36:45.000Z\",\n\t\t      \"download_price\": 6,\n\t\t      \"discount_description\": \"50% off all perfumes\",\n\t\t      \"regular_price\": 0,\n\t\t      \"discount_rate\": 0,\n\t\t      \"coupon_name\": \"Discount Perfume\",\n\t\t      \"coupon_generated_code\": \"j016qgqq\",\n\t\t      \"is_approved\": 1,\n\t\t      \"is_deleted\": 0,\n\t\t      \"list_rank\": 0,\n\t\t      \"deal_image\": \"image_name\",\n\t\t      \"paused\": 0,\n\t\t      \"daily_deal_description\": \"<p>Discount Perfumes at our following locations:</p>\\n\\n<ul>\\n\\t<li>2820 S. Jones Blvd. Las Vegas NV 89146</li>\\n\\t<li>817 S. Main St. Las Vegas NV 89101</li>\\n</ul>\\n\",\n\t\t      \"approved_category_id\": 3,\n\t\t      \"url\": \"http://ppc.l/api/click/deals/146/http%3A%2F%2Fiziphub.com%2FCategories%2Fdaily_deals_microsite%2F146\"\n\t\t    }\n\t\t  ],\n\t\t  \"page\": 1,\n\t\t  \"numRowsPerPage\": 10,\n\t\t  \"totalRows\": 2,\n\t\t  \"totalPages\": 1\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/download/deals/:dealId/:userId",
    "title": "Track Member Deal Download",
    "version": "0.1.0",
    "name": "TrackMemberDealDownload",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if download operation succeeds else False.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Confirmation message about the operation.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"status\": true, \n\t\t\"message\": \"download tracked.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/download.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/download/deals/:dealId",
    "title": "Track Non-member Deal Download",
    "version": "0.1.0",
    "name": "TrackNonMemberDealDownload",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if download operation succeeds else False.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Confirmation message about the operation.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n\t\t\"status\": true, \n\t\t\"message\": \"download tracked.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/download.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "put",
    "url": "/deals/:dealId/unpause",
    "title": "Unpause Daily Deal",
    "version": "0.1.0",
    "name": "UnpauseDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if unpause operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\" : true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "put",
    "url": "/deals/:dealId",
    "title": "Update Deal information",
    "version": "0.1.0",
    "name": "UpdateDeal",
    "group": "Daily_Deals",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealId",
            "description": "<p>Daily Deal Id</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "daily_deal",
            "description": "<p>Daily Deal json data</p>"
          },
          {
            "group": "Parameter",
            "type": "json",
            "optional": false,
            "field": "daily_deal_microsite",
            "description": "<p>Daily Deal Microsite json data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "    {\n      \"daily_deal\": {\n      \t\"coupon_name\": \"coupon name\",\n\t\t  \t\"coupon_image\": \"image_name\",\n\t\t  \t\"deal_image\": \"deal_image_name\",\n\t\t  \t\"coupon_generated_code\": \"CODE\",\n\t\t  \t\"budget_limit\": \"100\",\n\t\t  \t\"budget_period\": \"daily\",\n\t\t  \t\"business_id\": \"3\",\n\t\t  \t\"advertiser_id\": \"100\",\n\t\t  \t\"start_date\": \"2017-03-03\",\n\t\t  \t\"end_date\": \"2017-04-04\",\n\t\t  \t\"regular_price\": \"50\",\n\t\t  \t\"download_price\": \"10\",\n\t\t  \t\"suggested_category_id\": \"6\",\n\t\t  \t\"discount_type\": \"numeric\"\n      },\n      \n      \"daily_deal_microsite\": {\n      \t\"name\": \"Deal name\",\n\t  \t\t\"business_name\": \"business name\",\n\t  \t\t\"image\": \"image_name\",\n\t  \t\t\"address_1\": \"address_1\",\n\t  \t\t\"address_2\": \"address_2\",\n\t  \t\t\"state_id\": \"5\",\n\t  \t\t\"city\": \"Las Vegas\",\n\t  \t\t\"zip_code\": \"1234\",\n\t  \t\t\"phone_number\": \"0023423423\",\n\t  \t\t\"company_name\": \"company name\",\n\t  \t\t\"daily_deal_description\": \"daily deal description\",\n\t  \t\t\"what_you_get\": \"what you get\",\n\t  \t\t\"image_1\": \"image_1\",\n\t  \t\t\"image_2\": \"image_2\",\n\t  \t\t\"code\": \"CODE\",\n\t  \t\t\"download_file\": \"file name\",\n\t  \t\t\"download_filename\": \"file title\",\n\t  \t\t\"discount_daily_description\": \"discount description\",\n\t  \t\t\"discount_description\": \"discount description\",\n\t  \t\t\"location\": \"location\",\n\t  \t\t\"discount_percentage\": \"15\"\n      }\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if update operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\" : true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "post",
    "url": "/deals/upload?type=:imageType",
    "title": "Upload Deal Images",
    "description": "<p>Posible string values of imageType are: &quot;deal&quot;, &quot;deal_microsite&quot;, or &quot;coupon&quot;.</p>",
    "version": "0.1.0",
    "name": "UploadDealImages",
    "group": "Daily_Deals",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "imageInfo",
            "description": "<p>Uploaded Image Information.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t      \"banner_code\":\n\t      \"embeddable/html/code\",\n\t      \"banner_image_link\":\"path/to/image\",\n\t      \"banner_image_name\":\"image_name\"\n    }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/deal.js",
    "groupTitle": "Daily_Deals"
  },
  {
    "type": "get",
    "url": "/flexoffers/letters",
    "title": "Get Unique Initials of Flex Offer Names For Letter Pagination",
    "version": "0.1.0",
    "name": "GetFlexOfferLetters",
    "group": "Flex_Offers",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "letters",
            "description": "<p>Listing of Letters</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  \"a\",\n  \"b\",\n  \"c\",\n  \"d\",\n  \"f\",\n  \"l\",\n  \"m\",\n  \"n\",\n  \"o\",\n  \"s\",\n  \"t\",\n  \"v\",\n  \"w\"\n]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Flex_Offers"
  },
  {
    "type": "get",
    "url": "/search/flexoffers/:keyword",
    "title": "Get Flex Offers By Keyword",
    "version": "0.1.0",
    "name": "GetFlexOffersByKeyword",
    "group": "Flex_Offers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>Search Keyword.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "flexoffers",
            "description": "<p>List of Flex Offers that Matched Search Keyword.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    [\n\t\t  {\n\t\t    \"flexoffer_link_id\": 36057,\n\t\t    \"flexoffer_link_content\": \"<embeddable/code\",\n\t\t    \"flexoffer_link_subpage_id\": 1,\n\t\t    \"flexoffer_link_featured\": 0,\n\t\t    \"flexoffer_list_order\": 0,\n\t\t    \"flexoffer_list_order_asc\": 1000,\n\t\t    \"flexoffer_name\": \"local offer\",\n\t\t    \"keyword_id\": null,\n\t\t    \"flexSrc\": \"image_src\",\n\t\t    \"flexLink\": \"image_link\",\n\t\t    \"url\": \"http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!\"\n\t\t  },\n\t\t  {\n\t\t    \"flexoffer_link_id\": 36057,\n\t\t    \"flexoffer_link_content\": \"<embeddable/code\",\n\t\t    \"flexoffer_link_subpage_id\": 1,\n\t\t    \"flexoffer_link_featured\": 0,\n\t\t    \"flexoffer_list_order\": 0,\n\t\t    \"flexoffer_list_order_asc\": 1000,\n\t\t    \"flexoffer_name\": \"local offer\",\n\t\t    \"keyword_id\": null,\n\t\t    \"flexSrc\": \"image_src\",\n\t\t    \"flexLink\": \"image_link\",\n\t\t    \"url\": \"http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!\"\n\t\t  }\n\t\t]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Flex_Offers"
  },
  {
    "type": "get",
    "url": "/search/flexoffers/:subpageId",
    "title": "Get Flex Offers By Subpage Id",
    "version": "0.1.0",
    "name": "GetFlexOffersBySubpageId",
    "group": "Flex_Offers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subpageId",
            "description": "<p>Subpage Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "flexoffers",
            "description": "<p>List of Flex Offers In a Subpage.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    [\n\t\t  {\n\t\t    \"flexoffer_link_id\": 36057,\n\t\t    \"flexoffer_link_content\": \"<embeddable/code\",\n\t\t    \"flexoffer_link_subpage_id\": 1,\n\t\t    \"flexoffer_link_featured\": 0,\n\t\t    \"flexoffer_list_order\": 0,\n\t\t    \"flexoffer_list_order_asc\": 1000,\n\t\t    \"flexoffer_name\": \"local offer\",\n\t\t    \"keyword_id\": null,\n\t\t    \"flexSrc\": \"image_src\",\n\t\t    \"flexLink\": \"image_link\",\n\t\t    \"url\": \"http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!\"\n\t\t  },\n\t\t  {\n\t\t    \"flexoffer_link_id\": 36057,\n\t\t    \"flexoffer_link_content\": \"<embeddable/code\",\n\t\t    \"flexoffer_link_subpage_id\": 1,\n\t\t    \"flexoffer_link_featured\": 0,\n\t\t    \"flexoffer_list_order\": 0,\n\t\t    \"flexoffer_list_order_asc\": 1000,\n\t\t    \"flexoffer_name\": \"local offer\",\n\t\t    \"keyword_id\": null,\n\t\t    \"flexSrc\": \"image_src\",\n\t\t    \"flexLink\": \"image_link\",\n\t\t    \"url\": \"http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!\"\n\t\t  }\n\t\t]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Flex_Offers"
  },
  {
    "type": "get",
    "url": "/search/flexoffers/:subpageId/:keyword",
    "title": "Get Flex Offers By SubpageId and Keyword",
    "version": "0.1.0",
    "name": "GetFlexOffersBySubpageIdAndKeyword",
    "group": "Flex_Offers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>Search Keyword.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subpageId",
            "description": "<p>Subpage Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "flexoffers",
            "description": "<p>List of Flex Offers that Matched the Search Keyword and Subpage Id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    [\n\t\t  {\n\t\t    \"flexoffer_link_id\": 36057,\n\t\t    \"flexoffer_link_content\": \"<embeddable/code\",\n\t\t    \"flexoffer_link_subpage_id\": 1,\n\t\t    \"flexoffer_link_featured\": 0,\n\t\t    \"flexoffer_list_order\": 0,\n\t\t    \"flexoffer_list_order_asc\": 1000,\n\t\t    \"flexoffer_name\": \"local offer\",\n\t\t    \"keyword_id\": null,\n\t\t    \"flexSrc\": \"image_src\",\n\t\t    \"flexLink\": \"image_link\",\n\t\t    \"url\": \"http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!\"\n\t\t  },\n\t\t  {\n\t\t    \"flexoffer_link_id\": 36057,\n\t\t    \"flexoffer_link_content\": \"<embeddable/code\",\n\t\t    \"flexoffer_link_subpage_id\": 1,\n\t\t    \"flexoffer_link_featured\": 0,\n\t\t    \"flexoffer_list_order\": 0,\n\t\t    \"flexoffer_list_order_asc\": 1000,\n\t\t    \"flexoffer_name\": \"local offer\",\n\t\t    \"keyword_id\": null,\n\t\t    \"flexSrc\": \"image_src\",\n\t\t    \"flexLink\": \"image_link\",\n\t\t    \"url\": \"http://ppc.l/api/click/flexoffers/29807/http%3A%2F%2Fwww.tkqlhce.com%2Fclick-8072108-11757341-1430843951000%3Fcm_mmc%3DCJ-_-4746017-_-8072108-_-KA%2520-%2520Cirque%2520du%2520Soleil%2520Special%2520Offer%253a%2520Save%2520%2430!\"\n\t\t  }\n\t\t]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Flex_Offers"
  },
  {
    "type": "get",
    "url": "/click/flexoffers/:flexSearchId/:redirectUrl/:userId",
    "title": "Member Click Tracking of Flex Offers",
    "version": "0.1.0",
    "name": "MemberClickTrackingofFlexOffers",
    "group": "Flex_Offers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "flexSearchId",
            "description": "<p>Flex Search Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Flex_Offers"
  },
  {
    "type": "get",
    "url": "/click/flexoffers/:flexSearchId/:redirectUrl",
    "title": "Non-Member Click Tracking of Flex Offers",
    "version": "0.1.0",
    "name": "Non_MemberClickTrackingofFlexOffers",
    "group": "Flex_Offers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "flexSearchId",
            "description": "<p>Flex Search Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Flex_Offers"
  },
  {
    "type": "get",
    "url": "/advertisers",
    "title": "Get All Advertisers",
    "version": "0.1.0",
    "name": "GetAllAdvertisers",
    "group": "Miscellaneous",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "advertisers",
            "description": "<p>List of Advertisers.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n   {\n       \"advertizer_id\": 1,\n       \"advertizer_business_name\": \"PurchasePerfume.com\",\n       \"advertizer_phone_number\": \"7022035309\",\n       \"advertizer_contact_person\": \"\",\n       \"advertizer_title\": \"\",\n       \"advertizer_billing_address1\": \"10479 Brown Wolf St\",\n       \"advertizer_billing_address2\": \"\",\n       \"advertizer_profile_picture\": 0,\n       \"advertizer_city\": \"Las Vegas\",\n       \"advertizer_state\": 29,\n       \"advertizer_zipcode\": \"89178\",\n       \"advertizer_nearby_locations\": \"\",\n       \"advertizer_domain_name\": \"purchaseperfume.com\",\n       \"advertizer_user_id\": 145,\n       \"advertizer_approved\": \"1\",\n       \"advertizer_referer\": 1,\n       \"ziphub_referrer\": 59,\n       \"advertizer_deleted\": 0,\n       \"advertizer_created_on\": \"2016-06-06T10:06:12.000Z\",\n       \"advertizer_ethnicity\": 0,\n       \"advertizer_sex\": \"\",\n       \"advertizer_status\": 4\n     }\n     \n ]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Miscellaneous"
  },
  {
    "type": "get",
    "url": "/adSubpages",
    "title": "Get All Sponsored Ad Subpages",
    "version": "0.1.0",
    "name": "GetAllSponsoredAdSubpages",
    "group": "Miscellaneous",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "adSubpages",
            "description": "<p>List of Sponsored Ad Subpages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n     {\n       \"subpage_id\": 1,\n       \"subpage_name\": \"Local\"\n     },\n     {\n       \"subpage_id\": 6,\n       \"subpage_name\": \"Food and Restaurants\"\n     },\n     {\n       \"subpage_id\": 14,\n       \"subpage_name\": \"Business to Business\"\n     }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Miscellaneous"
  },
  {
    "type": "get",
    "url": "/subpages",
    "title": "Get All Subpages",
    "version": "0.1.0",
    "name": "GetAllSubpages",
    "group": "Miscellaneous",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "subpages",
            "description": "<p>List of Subpages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n     {\n       \"subpage_id\": 1,\n       \"subpage_name\": \"Local\"\n     },\n     {\n       \"subpage_id\": 2,\n       \"subpage_name\": \"Web Retailers\"\n     },\n     {\n       \"subpage_id\": 3,\n       \"subpage_name\": \"Fashion Shoes\"\n     }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Miscellaneous"
  },
  {
    "type": "get",
    "url": "/usastates",
    "title": "Get All USA States",
    "version": "0.1.0",
    "name": "GetAllUSAStates",
    "group": "Miscellaneous",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "usaStates",
            "description": "<p>List of USA States.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n   {\n       \"usa_state_id\": 1,\n       \"usa_state_code\": \"AL\",\n       \"usa_state_name\": \"Alabama\"\n     },\n     {\n       \"usa_state_id\": 2,\n       \"usa_state_code\": \"AK\",\n       \"usa_state_name\": \"Alaska\"\n     },\n     {\n       \"usa_state_id\": 3,\n       \"usa_state_code\": \"AZ\",\n       \"usa_state_name\": \"Arizona\"\n     },\n     {\n       \"usa_state_id\": 4,\n       \"usa_state_code\": \"AR\",\n       \"usa_state_name\": \"Arkansas\"\n     },\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Miscellaneous"
  },
  {
    "type": "get",
    "url": "/advertisers/:advertiserId",
    "title": "Get An Advertiser",
    "version": "0.1.0",
    "name": "GetAnAdvertiser",
    "group": "Miscellaneous",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "advertiser",
            "description": "<p>Details of an Advertiser.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"advertizer_id\": 1,\n    \"advertizer_business_name\": \"PurchasePerfume.com\",\n    \"advertizer_phone_number\": \"7022035309\",\n    \"advertizer_contact_person\": \"\",\n    \"advertizer_title\": \"\",\n    \"advertizer_billing_address1\": \"10479 Brown Wolf St\",\n    \"advertizer_billing_address2\": \"\",\n    \"advertizer_profile_picture\": 0,\n    \"advertizer_city\": \"Las Vegas\",\n    \"advertizer_state\": 29,\n    \"advertizer_zipcode\": \"89178\",\n    \"advertizer_nearby_locations\": \"\",\n    \"advertizer_domain_name\": \"purchaseperfume.com\",\n    \"advertizer_user_id\": 145,\n    \"advertizer_approved\": \"1\",\n    \"advertizer_referer\": 1,\n    \"ziphub_referrer\": 59,\n    \"advertizer_deleted\": 0,\n    \"advertizer_created_on\": \"2016-06-06T10:06:12.000Z\",\n    \"advertizer_ethnicity\": 0,\n    \"advertizer_sex\": \"\",\n    \"advertizer_status\": 4\n }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Miscellaneous"
  },
  {
    "type": "get",
    "url": "/businesses/advertisers/:advertiserId",
    "title": "Get Advertiser's Business",
    "version": "0.1.0",
    "name": "GetAnAdvertiserBusiness",
    "group": "Miscellaneous",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "businesses",
            "description": "<p>Business information of an advertiser.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"id\": 17,\n    \"advertiser_id\": 753,\n    \"advertiser_user_id\": 1904,\n    \"business_type_id\": 1,\n    \"name\": \"hjf\",\n    \"address\": \"jhf\",\n    \"city\": \"hjdhf\",\n    \"state\": 1,\n    \"zip_code\": \"979\",\n    \"email\": \"mdnf@jfgkjg.com\",\n    \"website_url\": \"jfgkjg\",\n    \"phone_number\": \"989\",\n    \"weekdays_start\": \"Mon\",\n    \"weekdays_end\": \"Mon\",\n    \"weekdays_start_time\": 8,\n    \"weekdays_end_time\": 4,\n    \"weekend_start\": \"Mon\",\n    \"weekend_end\": \"\",\n    \"weekend_start_time\": 8,\n    \"weekend_end_time\": 4,\n    \"summary\": \"fjghkjhg                         \",\n    \"created_on\": \"2017-03-14T14:48:11.000Z\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Miscellaneous"
  },
  {
    "type": "put",
    "url": "/ads/:adId/approve",
    "title": "Approve Sponsored Ads",
    "version": "0.1.0",
    "name": "ApproveSponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if approve operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/ads.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "put",
    "url": "/ads/:adId/disapprove",
    "title": "Disapprove Sponsored Ads",
    "version": "0.1.0",
    "name": "DisapproveSponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if approve operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/ads.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "put",
    "url": "/ads/:adId/featured",
    "title": "Make A Sponsored Ad featured.",
    "version": "0.1.0",
    "name": "FeaturedponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if approve operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/ads.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/categories",
    "title": "Get All Sponsored Ad Keyword Categories",
    "version": "0.1.0",
    "name": "GetAllKeywordCategories",
    "group": "Sponsored_Ads",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "keywordCategories",
            "description": "<p>List of Sponsored Ad Keyword Categories.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n   {\n       \"id\": 6,\n       \"name\": \"Telecom\",\n       \"is_deleted\": 0\n   },\n   {\n       \"id\": 7,\n       \"name\": \"Electronics\",\n       \"is_deleted\": 0\n   },\n   {\n       \"id\": 8,\n       \"name\": \"MEN'S FASHION\",\n       \"is_deleted\": 0\n   }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/keywords",
    "title": "Get All Sponsored Ad Keywords",
    "version": "0.1.0",
    "name": "GetAllKeywords",
    "group": "Sponsored_Ads",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "keywords",
            "description": "<p>List of Sponsored Ad Keyworda.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n   {\n     \"id\": 10,\n     \"keyword\": \"telecommunication\",\n     \"price\": 10,\n     \"created_by\": 164\n   },\n   {\n     \"id\": 11,\n     \"keyword\": \"mobile phones\",\n     \"price\": 0.5,\n     \"created_by\": 164\n   },\n   {\n     \"id\": 12,\n     \"keyword\": \"new key\",\n     \"price\": 1,\n     \"created_by\": 231\n   }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/ads/:subpageId/featured",
    "title": "Get Featured Sponsored Ads By Subpage Id",
    "version": "0.1.0",
    "name": "GetFeaturedponsoredAdsBySubpageId",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subpageId",
            "description": "<p>Subpage ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "featuredAds",
            "description": "<p>List of Featured Ads In A Category.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\n     \"usa_state_code\": \"NV\",\n     \"usa_state_name\": \"Nevada\",\n     \"city\": \"Las vegas\",\n     \"zipcode\": \"89146\",\n     \"ad_id\": 148,\n     \"url\": \"www.yyt.com\",\n     \"title\": \"test\",\n     \"address\": \"7865 w sahara\",\n     \"lat\": null,\n     \"lng\": null,\n     \"phone_no\": \"7023062676\",\n     \"sub_page_id\": 1,\n     \"ad_text\": \"test\",\n     \"redirectUrl\": \"http://54.67.28.43:8081/api/click/f_ads/148/1/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F148\"\n   },\n   {\n     \"usa_state_code\": \"NV\",\n     \"usa_state_name\": \"Nevada\",\n     \"city\": \"las vegas\",\n     \"zipcode\": \"89146\",\n     \"ad_id\": 155,\n     \"url\": \"http://www.actionprintingservice.com/\",\n     \"title\": \"Sport Events\",\n     \"address\": \"Bethole\",\n     \"lat\": \"17.5603359\",\n     \"lng\": \"79.99794109999999\",\n     \"phone_no\": \"251911448404\",\n     \"sub_page_id\": 1,\n     \"ad_text\": \"Sport Events\",\n     \"redirectUrl\": \"http://54.67.28.43:8081/api/click/f_ads/155/1/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F155\"\n   }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/ads.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/keywords",
    "title": "Get Sponsored Ad Keyword",
    "version": "0.1.0",
    "name": "GetKeyword",
    "group": "Sponsored_Ads",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "keyword",
            "description": "<p>Details of A Sponsored Ad Keyword.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n [\n   {\n     \"id\": 10,\n     \"keyword\": \"telecommunication\",\n     \"price\": 10,\n     \"created_by\": 164\n   }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/analytics/ads/:adId",
    "title": "Get Sponsored Ad Analytics",
    "version": "0.1.0",
    "name": "GetSponsoredAdAnalytics",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "adAnalytics",
            "description": "<p>List of Sponsored Ad Analytics.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    [\n\t\t  {\n\t\t    \"item_type_id\": 1,\n\t\t    \"keyword\": \"Elegant\",\n\t\t    \"activity_type_id\": 2,\n\t\t    \"actor_type_id\": 4,\n\t\t    \"item_id\": 1018,\n\t\t    \"actor_id\": 409,\n\t\t    \"activity_time\": \"2017-03-09T15:51:29.000Z\",\n\t\t    \"ip_address\": \"::ffff:172.31.17.91\",\n\t\t    \"user_agent\": \"Chromium 56.0.2924 / Ubuntu 0.0.0\",\n\t\t    \"device_version\": \"Other 0.0.0\",\n\t\t    \"ad_id\": 144,\n\t\t    \"keyword_id\": 2862,\n\t\t    \"keyword_category_id\": 8,\n\t\t    \"ad_location_id\": 156,\n\t\t    \"ad_subpage_id\": 1,\n\t\t    \"price\": 1,\n\t\t    \"url\": \"www.fasil.com\",\n\t\t    \"title\": \"Facilo's Ad\",\n\t\t    \"address\": \"817 S Main St, Las Vegas, NV 89101\",\n\t\t    \"lat\": null,\n\t\t    \"lng\": null,\n\t\t    \"phone_no\": \"251911448404\",\n\t\t    \"ad_text\": \"Facilo's ad\",\n\t\t    \"ad_keyword_id\": 191\n\t\t  },\n\t\t  {\n\t\t    \"item_type_id\": 1,\n\t\t    \"keyword\": \"Elegant\",\n\t\t    \"activity_type_id\": 1,\n\t\t    \"actor_type_id\": 4,\n\t\t    \"item_id\": 1018,\n\t\t    \"actor_id\": 409,\n\t\t    \"activity_time\": \"2017-03-09T15:52:07.000Z\",\n\t\t    \"ip_address\": \"::ffff:172.31.17.91\",\n\t\t    \"user_agent\": \"Other 0.0.0 / Other 0.0.0\",\n\t\t    \"device_version\": \"Other 0.0.0\",\n\t\t    \"ad_id\": 144,\n\t\t    \"keyword_id\": 2862,\n\t\t    \"keyword_category_id\": 8,\n\t\t    \"ad_location_id\": 156,\n\t\t    \"ad_subpage_id\": 1,\n\t\t    \"price\": 1,\n\t\t    \"url\": \"www.fasil.com\",\n\t\t    \"title\": \"Facilo's Ad\",\n\t\t    \"address\": \"817 S Main St, Las Vegas, NV 89101\",\n\t\t    \"lat\": null,\n\t\t    \"lng\": null,\n\t\t    \"phone_no\": \"251911448404\",\n\t\t    \"ad_text\": \"Facilo's ad\",\n\t\t    \"ad_keyword_id\": 191\n\t\t  }\n\t\t]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/analytic.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/click/f_ads/:adId/:subpageId/:redirectUrl/:userId",
    "title": "Member Click Tracking of Featured Sponsored Ads",
    "version": "0.1.0",
    "name": "MemberClickTrackingofFeaturedSponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subpageId",
            "description": "<p>Subpage Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/click/ads/:searchId/:redirectUrl/:userId",
    "title": "Member Click Tracking of Sponsored Ads",
    "version": "0.1.0",
    "name": "MemberClickTrackingofSponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "searchId",
            "description": "<p>Search Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/search/ads/:keyword/:location/:subPage/:userId",
    "title": "Member Sponsored Ad Search",
    "version": "0.1.0",
    "name": "MemberSponsoredAdSearch",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>Search keyword.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Search Location (city/zipcode).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subPage",
            "description": "<p>Subpage Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userId",
            "description": "<p>User Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of matched sponsored ads.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": [\n\t\t    {\n\t\t      \"ad_keyword_id\": 192,\n\t\t      \"usa_state_code\": \"NV\",\n\t\t      \"usa_state_name\": \"Nevada\",\n\t\t      \"city\": \"Las Vegas\",\n\t\t      \"zipcode\": \"1234\",\n\t\t      \"ad_id\": 144,\n\t\t      \"url\": \"www.facilo.com\",\n\t\t      \"title\": \"Facilo's Ad\",\n\t\t      \"address\": \"817 S Main St, Las Vegas, NV 89101\",\n\t\t      \"lat\": null,\n\t\t      \"lng\": null,\n\t\t      \"phone_no\": \"251911448404\",\n\t\t      \"ad_text\": \"Facilo's ad\",\n\t\t      \"price\": 10,\n\t\t      \"keyword_category_id\": 9,\n\t\t      \"ad_location_id\": 156,\n\t\t      \"ad_subpage_id\": 1,\n\t\t      \"keyword_id\": 10,\n\t\t      \"redirectUrl\": \"http://ppc.l/api/click/ads/196/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F144\"\n\t\t    }\n\t\t  ],\n\t\t  \"page\": 1,\n\t\t  \"numRowsPerPage\": 10,\n\t\t  \"totalRows\": 2,\n\t\t  \"totalPages\": 1\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/click/f_ads/:adId/:subpageId/:redirectUrl",
    "title": "Non-Member Click Tracking of Featured Sponsored Ads",
    "version": "0.1.0",
    "name": "NonMemberClickTrackingofFeaturedSponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subpageId",
            "description": "<p>Subpage Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/click/ads/:searchId/:redirectUrl",
    "title": "Non-Member Click Tracking of Sponsored Ads",
    "version": "0.1.0",
    "name": "NonMemberClickTrackingofSponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "searchId",
            "description": "<p>Search Id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "redirectUrl",
            "description": "<p>Redirect URL After Click Tracking.</p>"
          }
        ]
      }
    },
    "filename": "routes/click.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "get",
    "url": "/search/ads/:keyword/:location/:subPage",
    "title": "Non-member Sponsored Ad Search",
    "version": "0.1.0",
    "name": "NonMemberSponsoredAdSearch",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "keyword",
            "description": "<p>Search keyword.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Search Location (city/zipcode).</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "subPage",
            "description": "<p>Subpage Id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>List of matched sponsored ads.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n\t\t  \"result\": [\n\t\t    {\n\t\t      \"ad_keyword_id\": 192,\n\t\t      \"usa_state_code\": \"NV\",\n\t\t      \"usa_state_name\": \"Nevada\",\n\t\t      \"city\": \"Las Vegas\",\n\t\t      \"zipcode\": \"1234\",\n\t\t      \"ad_id\": 144,\n\t\t      \"url\": \"www.facilo.com\",\n\t\t      \"title\": \"Facilo's Ad\",\n\t\t      \"address\": \"817 S Main St, Las Vegas, NV 89101\",\n\t\t      \"lat\": null,\n\t\t      \"lng\": null,\n\t\t      \"phone_no\": \"251911448404\",\n\t\t      \"ad_text\": \"Facilo's ad\",\n\t\t      \"price\": 10,\n\t\t      \"keyword_category_id\": 9,\n\t\t      \"ad_location_id\": 156,\n\t\t      \"ad_subpage_id\": 1,\n\t\t      \"keyword_id\": 10,\n\t\t      \"redirectUrl\": \"http://ppc.l/api/click/ads/196/http%3A%2F%2Fiziphub.com%2FCategories%2Flisting_microsite%2F144\"\n\t\t    }\n\t\t  ],\n\t\t  \"page\": 1,\n\t\t  \"numRowsPerPage\": 10,\n\t\t  \"totalRows\": 2,\n\t\t  \"totalPages\": 1\n\t\t}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "put",
    "url": "/ads/:adId/notfeatured",
    "title": "Make A Sponsored Ad not featured.",
    "version": "0.1.0",
    "name": "NotFeaturedponsoredAds",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if approve operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/ads.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "put",
    "url": "/ads/:adId/unpause",
    "title": "Unpause A Sponsored Ad.",
    "version": "0.1.0",
    "name": "UnpauseASponsoredAd",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if approve operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/ads.js",
    "groupTitle": "Sponsored_Ads"
  },
  {
    "type": "put",
    "url": "/ads/:adId/pause",
    "title": "Pause A Sponsored Ad.",
    "version": "0.1.0",
    "name": "pauseASponsoredAd",
    "group": "Sponsored_Ads",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "adId",
            "description": "<p>Sponsored Ad Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>True if approve operation succeeds else False.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/ads.js",
    "groupTitle": "Sponsored_Ads"
  }
] });
