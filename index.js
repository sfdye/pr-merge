module.exports = (robot) => {
  robot.on('pull_request.closed', async (context) => {
    const { merged, head } = context.payload.pull_request

    if (merged) {
      const branch = head.label
      const params = context.issue({
        body: `Congratulations on the merge :tada: Don't forget to delete the branch \`${branch}\`.`
      })

      try {
        await context.github.issues.createComment(params)
      } catch (err) {
        if (err.code !== 404) {
          throw err
        }
      }
    }
  })
}
