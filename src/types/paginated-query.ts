export type PaginatedQueryResult<Entity> = {
    page: number;
    limit: number;
    count: number;
    data: Entity[];
}