'use strict';

/**
 * A set of functions called "actions" for `setUserName`
 */

module.exports = {
  async this.saveDetails(ctx, next) {
    try {
      const data = await strapi
        .service("api::posts-report.posts-report")
        .postsReport();
      console.log(data, "data");

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
