/**
 * types for Configuration (favorites)
 */
import {TagExtended} from "~/types/tags";

export interface Configuration {
  name: string,
  title: string,
  id: number,
  tags: TagExtended[]
}

export interface UpdateConfigurationRequest {
  name: string,
  title?: string,
  id: number,
  tags: number[]
}

export interface CreateConfigurationRequest {
  name: string,
  title?: string,
  tags: number[]
}
