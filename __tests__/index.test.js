const { createRobot } = require('probot')
const sinon = require('sinon')
const app = require('../index')
const payload = require('./fixtures/payload')

const initMock = (github) => {
  const robot = createRobot()
  robot.auth = sinon.stub().resolves(github)
  app(robot)

  return robot
}

const getGithubMock = () => ({
  issues: {
    createComment: sinon.stub()
  }
})

class NotFoundError extends Error {
  constructor (code) {
    super()
    this.code = code
  }
}

describe('app plugin test', () => {
  describe('should resolve', () => {
    let robot
    let githubMock = getGithubMock()

    beforeEach(() => {
      robot = initMock(githubMock)
      githubMock.issues.createComment.resolves()
    })

    it('should performs an action', async () => {
      const expectedParams = {
        number: 21,
        owner: 'owner',
        repo: 'testing-things',
        body: 'Congratulations on the merge :tada: Don\'t forget to delete the branch `This is a label`.'
      }

      await robot.receive(payload)

      expect(githubMock.issues.createComment.calledOnce).toEqual(true)
      expect(githubMock.issues.createComment.args[0][0]).toEqual(expectedParams)
    })
  })

  describe('should reject', () => {
    let robot
    let githubMock = getGithubMock()

    beforeEach(() => {
      githubMock.issues.createComment.rejects(new NotFoundError())
      robot = initMock(githubMock)
    })

    it('should throw exception', async () => {
      try {
        await robot.receive(payload)
      } catch (err) {
        expect(err instanceof NotFoundError).toEqual(true)
      }
    })
  })
})
