export interface HAEntity {
  entity_id: string;
  state: string;
  attributes?: Record<string, any>;
  domain?: string;
}
