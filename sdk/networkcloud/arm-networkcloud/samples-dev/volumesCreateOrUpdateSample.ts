/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Volume, NetworkCloud } from "@azure/arm-networkcloud";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to Create a new volume or update the properties of the existing one.
 *
 * @summary Create a new volume or update the properties of the existing one.
 * x-ms-original-file: specification/networkcloud/resource-manager/Microsoft.NetworkCloud/preview/2022-12-12-preview/examples/Volumes_Create.json
 */
async function createOrUpdateVolume() {
  const subscriptionId =
    process.env["NETWORKCLOUD_SUBSCRIPTION_ID"] || "subscriptionId";
  const resourceGroupName =
    process.env["NETWORKCLOUD_RESOURCE_GROUP"] || "resourceGroupName";
  const volumeName = "volumeName";
  const volumeParameters: Volume = {
    extendedLocation: {
      name:
        "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.ExtendedLocation/customLocations/clusterExtendedLocationName",
      type: "CustomLocation"
    },
    location: "location",
    sizeMiB: 10000,
    tags: { key1: "myvalue1", key2: "myvalue2" }
  };
  const credential = new DefaultAzureCredential();
  const client = new NetworkCloud(credential, subscriptionId);
  const result = await client.volumes.beginCreateOrUpdateAndWait(
    resourceGroupName,
    volumeName,
    volumeParameters
  );
  console.log(result);
}

async function main() {
  createOrUpdateVolume();
}

main().catch(console.error);
