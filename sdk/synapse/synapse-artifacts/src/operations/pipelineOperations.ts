/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { tracingClient } from "../tracing";
import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper";
import { PipelineOperations } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { ArtifactsClient } from "../artifactsClient";
import { PollerLike, PollOperationState, LroEngine } from "@azure/core-lro";
import { LroImpl } from "../lroImpl";
import {
  PipelineResource,
  PipelineGetPipelinesByWorkspaceNextOptionalParams,
  PipelineGetPipelinesByWorkspaceOptionalParams,
  PipelineGetPipelinesByWorkspaceResponse,
  PipelineCreateOrUpdatePipelineOptionalParams,
  PipelineCreateOrUpdatePipelineResponse,
  PipelineGetPipelineOptionalParams,
  PipelineGetPipelineResponse,
  PipelineDeletePipelineOptionalParams,
  ArtifactRenameRequest,
  PipelineRenamePipelineOptionalParams,
  PipelineCreatePipelineRunOptionalParams,
  PipelineCreatePipelineRunResponse,
  PipelineGetPipelinesByWorkspaceNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing PipelineOperations operations. */
export class PipelineOperationsImpl implements PipelineOperations {
  private readonly client: ArtifactsClient;

  /**
   * Initialize a new instance of the class PipelineOperations class.
   * @param client Reference to the service client
   */
  constructor(client: ArtifactsClient) {
    this.client = client;
  }

  /**
   * Lists pipelines.
   * @param options The options parameters.
   */
  public listPipelinesByWorkspace(
    options?: PipelineGetPipelinesByWorkspaceOptionalParams
  ): PagedAsyncIterableIterator<PipelineResource> {
    const iter = this.getPipelinesByWorkspacePagingAll(options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.getPipelinesByWorkspacePagingPage(options, settings);
      }
    };
  }

  private async *getPipelinesByWorkspacePagingPage(
    options?: PipelineGetPipelinesByWorkspaceOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<PipelineResource[]> {
    let result: PipelineGetPipelinesByWorkspaceResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._getPipelinesByWorkspace(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._getPipelinesByWorkspaceNext(
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *getPipelinesByWorkspacePagingAll(
    options?: PipelineGetPipelinesByWorkspaceOptionalParams
  ): AsyncIterableIterator<PipelineResource> {
    for await (const page of this.getPipelinesByWorkspacePagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Lists pipelines.
   * @param options The options parameters.
   */
  private async _getPipelinesByWorkspace(
    options?: PipelineGetPipelinesByWorkspaceOptionalParams
  ): Promise<PipelineGetPipelinesByWorkspaceResponse> {
    return tracingClient.withSpan(
      "ArtifactsClient._getPipelinesByWorkspace",
      options ?? {},
      async (options) => {
        return this.client.sendOperationRequest(
          { options },
          getPipelinesByWorkspaceOperationSpec
        ) as Promise<PipelineGetPipelinesByWorkspaceResponse>;
      }
    );
  }

  /**
   * Creates or updates a pipeline.
   * @param pipelineName The pipeline name.
   * @param pipeline Pipeline resource definition.
   * @param options The options parameters.
   */
  async beginCreateOrUpdatePipeline(
    pipelineName: string,
    pipeline: PipelineResource,
    options?: PipelineCreateOrUpdatePipelineOptionalParams
  ): Promise<
    PollerLike<
      PollOperationState<PipelineCreateOrUpdatePipelineResponse>,
      PipelineCreateOrUpdatePipelineResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<PipelineCreateOrUpdatePipelineResponse> => {
      return tracingClient.withSpan(
        "ArtifactsClient.beginCreateOrUpdatePipeline",
        options ?? {},
        async () => {
          return this.client.sendOperationRequest(args, spec) as Promise<
            PipelineCreateOrUpdatePipelineResponse
          >;
        }
      );
    };
    const sendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = new LroImpl(
      sendOperation,
      { pipelineName, pipeline, options },
      createOrUpdatePipelineOperationSpec
    );
    const poller = new LroEngine(lro, {
      resumeFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs
    });
    await poller.poll();
    return poller;
  }

  /**
   * Creates or updates a pipeline.
   * @param pipelineName The pipeline name.
   * @param pipeline Pipeline resource definition.
   * @param options The options parameters.
   */
  async beginCreateOrUpdatePipelineAndWait(
    pipelineName: string,
    pipeline: PipelineResource,
    options?: PipelineCreateOrUpdatePipelineOptionalParams
  ): Promise<PipelineCreateOrUpdatePipelineResponse> {
    const poller = await this.beginCreateOrUpdatePipeline(
      pipelineName,
      pipeline,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Gets a pipeline.
   * @param pipelineName The pipeline name.
   * @param options The options parameters.
   */
  async getPipeline(
    pipelineName: string,
    options?: PipelineGetPipelineOptionalParams
  ): Promise<PipelineGetPipelineResponse> {
    return tracingClient.withSpan(
      "ArtifactsClient.getPipeline",
      options ?? {},
      async (options) => {
        return this.client.sendOperationRequest(
          { pipelineName, options },
          getPipelineOperationSpec
        ) as Promise<PipelineGetPipelineResponse>;
      }
    );
  }

  /**
   * Deletes a pipeline.
   * @param pipelineName The pipeline name.
   * @param options The options parameters.
   */
  async beginDeletePipeline(
    pipelineName: string,
    options?: PipelineDeletePipelineOptionalParams
  ): Promise<PollerLike<PollOperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<void> => {
      return tracingClient.withSpan(
        "ArtifactsClient.beginDeletePipeline",
        options ?? {},
        async () => {
          return this.client.sendOperationRequest(args, spec) as Promise<void>;
        }
      );
    };
    const sendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = new LroImpl(
      sendOperation,
      { pipelineName, options },
      deletePipelineOperationSpec
    );
    const poller = new LroEngine(lro, {
      resumeFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs
    });
    await poller.poll();
    return poller;
  }

  /**
   * Deletes a pipeline.
   * @param pipelineName The pipeline name.
   * @param options The options parameters.
   */
  async beginDeletePipelineAndWait(
    pipelineName: string,
    options?: PipelineDeletePipelineOptionalParams
  ): Promise<void> {
    const poller = await this.beginDeletePipeline(pipelineName, options);
    return poller.pollUntilDone();
  }

  /**
   * Renames a pipeline.
   * @param pipelineName The pipeline name.
   * @param request proposed new name.
   * @param options The options parameters.
   */
  async beginRenamePipeline(
    pipelineName: string,
    request: ArtifactRenameRequest,
    options?: PipelineRenamePipelineOptionalParams
  ): Promise<PollerLike<PollOperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<void> => {
      return tracingClient.withSpan(
        "ArtifactsClient.beginRenamePipeline",
        options ?? {},
        async () => {
          return this.client.sendOperationRequest(args, spec) as Promise<void>;
        }
      );
    };
    const sendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = new LroImpl(
      sendOperation,
      { pipelineName, request, options },
      renamePipelineOperationSpec
    );
    const poller = new LroEngine(lro, {
      resumeFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs
    });
    await poller.poll();
    return poller;
  }

  /**
   * Renames a pipeline.
   * @param pipelineName The pipeline name.
   * @param request proposed new name.
   * @param options The options parameters.
   */
  async beginRenamePipelineAndWait(
    pipelineName: string,
    request: ArtifactRenameRequest,
    options?: PipelineRenamePipelineOptionalParams
  ): Promise<void> {
    const poller = await this.beginRenamePipeline(
      pipelineName,
      request,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Creates a run of a pipeline.
   * @param pipelineName The pipeline name.
   * @param options The options parameters.
   */
  async createPipelineRun(
    pipelineName: string,
    options?: PipelineCreatePipelineRunOptionalParams
  ): Promise<PipelineCreatePipelineRunResponse> {
    return tracingClient.withSpan(
      "ArtifactsClient.createPipelineRun",
      options ?? {},
      async (options) => {
        return this.client.sendOperationRequest(
          { pipelineName, options },
          createPipelineRunOperationSpec
        ) as Promise<PipelineCreatePipelineRunResponse>;
      }
    );
  }

  /**
   * GetPipelinesByWorkspaceNext
   * @param nextLink The nextLink from the previous successful call to the GetPipelinesByWorkspace
   *                 method.
   * @param options The options parameters.
   */
  private async _getPipelinesByWorkspaceNext(
    nextLink: string,
    options?: PipelineGetPipelinesByWorkspaceNextOptionalParams
  ): Promise<PipelineGetPipelinesByWorkspaceNextResponse> {
    return tracingClient.withSpan(
      "ArtifactsClient._getPipelinesByWorkspaceNext",
      options ?? {},
      async (options) => {
        return this.client.sendOperationRequest(
          { nextLink, options },
          getPipelinesByWorkspaceNextOperationSpec
        ) as Promise<PipelineGetPipelinesByWorkspaceNextResponse>;
      }
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getPipelinesByWorkspaceOperationSpec: coreClient.OperationSpec = {
  path: "/pipelines",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.PipelineListResponse
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion4],
  urlParameters: [Parameters.endpoint],
  headerParameters: [Parameters.accept],
  serializer
};
const createOrUpdatePipelineOperationSpec: coreClient.OperationSpec = {
  path: "/pipelines/{pipelineName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.PipelineResource
    },
    201: {
      bodyMapper: Mappers.PipelineResource
    },
    202: {
      bodyMapper: Mappers.PipelineResource
    },
    204: {
      bodyMapper: Mappers.PipelineResource
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  requestBody: Parameters.pipeline,
  queryParameters: [Parameters.apiVersion4],
  urlParameters: [Parameters.endpoint, Parameters.pipelineName],
  headerParameters: [
    Parameters.accept,
    Parameters.contentType,
    Parameters.ifMatch
  ],
  mediaType: "json",
  serializer
};
const getPipelineOperationSpec: coreClient.OperationSpec = {
  path: "/pipelines/{pipelineName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.PipelineResource
    },
    304: {},
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion4],
  urlParameters: [Parameters.endpoint, Parameters.pipelineName],
  headerParameters: [Parameters.accept, Parameters.ifNoneMatch],
  serializer
};
const deletePipelineOperationSpec: coreClient.OperationSpec = {
  path: "/pipelines/{pipelineName}",
  httpMethod: "DELETE",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion4],
  urlParameters: [Parameters.endpoint, Parameters.pipelineName],
  headerParameters: [Parameters.accept],
  serializer
};
const renamePipelineOperationSpec: coreClient.OperationSpec = {
  path: "/pipelines/{pipelineName}/rename",
  httpMethod: "POST",
  responses: {
    200: {},
    201: {},
    202: {},
    204: {},
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  requestBody: Parameters.request,
  queryParameters: [Parameters.apiVersion4],
  urlParameters: [Parameters.endpoint, Parameters.pipelineName],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const createPipelineRunOperationSpec: coreClient.OperationSpec = {
  path: "/pipelines/{pipelineName}/createRun",
  httpMethod: "POST",
  responses: {
    202: {
      bodyMapper: Mappers.CreateRunResponse
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  requestBody: Parameters.parameters,
  queryParameters: [
    Parameters.apiVersion4,
    Parameters.referencePipelineRunId,
    Parameters.isRecovery,
    Parameters.startActivityName
  ],
  urlParameters: [Parameters.endpoint, Parameters.pipelineName],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const getPipelinesByWorkspaceNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.PipelineListResponse
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  urlParameters: [Parameters.endpoint, Parameters.nextLink],
  headerParameters: [Parameters.accept],
  serializer
};
