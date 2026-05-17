    "/api/Reports/daily": {
      "get": {
        "tags": [
          "Reports"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              }
            }
          }
        }
      }
    },
    "/api/Reports/monthly": {
      "get": {
        "tags": [
          "Reports"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              }
            }
          }
        }
      }
    },
    "/api/Reports/yearly": {
      "get": {
        "tags": [
          "Reports"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReportEntityResponseAPI"
                }
              }
            }
          }
        }
      }
    }

now we have the module for the Reports page we should make it 3 sectoins one for each endpoint

could you make sure it works right and if the data is empty we say that make sure the sectoin looks good in the admin dashboard and add a button to clear all data
