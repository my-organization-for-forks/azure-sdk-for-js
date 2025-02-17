// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const MapsSearch = require("@azure-rest/maps-search").default,
  { isUnexpected } = require("@azure-rest/maps-search");
const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config();

/**
 * @summary This sample demonstrates how to get all point-of-interest categories.
 */
async function main() {
  /**
   * Azure Maps supports two ways to authenticate requests:
   * - Shared Key authentication (subscription-key)
   * - Azure Active Directory (Azure AD) authentication
   *
   * In this sample you can put MAPS_SUBSCRIPTION_KEY into .env file to use the first approach or populate
   * the three AZURE_CLIENT_ID, AZURE_CLIENT_SECRET & AZURE_TENANT_ID variables for trying out AAD auth.
   *
   * More info is available at https://docs.microsoft.com/en-us/azure/azure-maps/azure-maps-authentication.
   */
  /** Shared Key authentication (subscription-key) */
  const subscriptionKey = process.env.MAPS_SUBSCRIPTION_KEY || "";
  const credential = new AzureKeyCredential(subscriptionKey);
  const client = MapsSearch(credential);

  /** Azure Active Directory (Azure AD) authentication */
  // const credential = new DefaultAzureCredential();
  // const mapsClientId = process.env.MAPS_CLIENT_ID || "";
  // const client = MapsSearch(credential, mapsClientId);

  /** Make the request. */
  const response = await client.path("/search/poi/category/tree/{format}", "json").get();

  /** Handle error response. */
  if (isUnexpected(response)) {
    throw response.body.error;
  }

  /** Log the response */
  if (!response.body.poiCategories) {
    throw new Error("Unexpected response: poiCategories is undefined");
  }
  response.body.poiCategories.forEach((category) => {
    console.log(`The info of the category ${category.name}:`);
    console.log(`  id: ${category.id}`);
    console.log(`  synonyms: ${category.synonyms}`);
    console.log(`  child category Ids: ${category.childCategoryIds}\n`);
  });
}

main().catch(console.error);
