export interface Pageable {
  /*
   * Number of items on the current page
   */
  count: number;

  /*
   * Total number of items
   */
  total: number;

  /*
   * Current page
   */
  page: number;

  /*
   * Total number of pages
   */
  pageCount: number;
}
