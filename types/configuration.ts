/**
 * types for Configuration (favorites)
 */
import {TagExtended, TagExtendedWithTotal} from "~/types/tags";

export interface Configuration {
  name: string,
  title: string,
  id: number,
  tags: TagExtendedWithTotal[]
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
