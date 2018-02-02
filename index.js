module.exports = (robot) => {
  robot.on('pull_request.closed', async context => {
    if (context.payload.pull_request.merged) {
      const branch = context.payload.pull_request.head.label
      const params = context.issue({
        body: `Congratulations on the merge :tada: Don't forget to delete the branch \`${branch}\`.`
      })

      try {
        context.github.issues.createComment(params)
      } catch (err) {
        if (err.code !== 404) {
          throw err
        }
      }
    }
  })
}
