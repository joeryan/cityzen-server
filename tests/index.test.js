const supertest = require('supertest')
const app = require('../src/app')
const config = require('../src/config')
const MemoryTasksBackend = require('../src/memory_tasks_backend')

describe('Test that the basic routes return dummy data', () => {
  // Jest doesn't pass command line arguments through to tests:
  // https://github.com/facebook/jest/issues/5089
  // For now, override the backend config manually.
  config.tasks.backend = new MemoryTasksBackend()

  test('PUT /tasks/backend/', async () => {
    const { body } = await supertest(await app(config))
      .put('/tasks/backend/')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send([{
        taskId: 'taskid',
        name: 'Task Name',
        description: 'Task description',
        status: 'todo'
      }])
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(body).toEqual([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])
  })

  test('GET /tasks/', async () => {
    await config.tasks.backend.setTasks([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])

    const { body } = await supertest(await app(config))
      .get('/tasks/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(body).toEqual([{
      taskId: 'taskid',
      name: 'Task Name',
      description: 'Task description',
      status: 'todo'
    }])
  })

  test('POST /tasks/volunteer', async () => {
    return supertest(await app(config))
      .post('/tasks/volunteer')
      .send({
        email: 'example@example.com',
        taskIds: ['uuid']
      })
      .expect(201)
  })

  test.todo('POST /user/report')
})

describe('Test various utility functions', () => {
  const { merge } = require('../src/utilities')

  test('utilities.merge', () => {
    expect(merge({}, {})).toEqual({})

    expect(merge({}, { hello: 'world' })).toEqual({ hello: 'world' })

    expect(merge(
      { foo: 'bar' }, { hello: 'world' }
    )).toEqual({ hello: 'world', foo: 'bar' })

    expect(merge(
      { foo: 'bar', hello: 'friend' }, { hello: 'world' })
    ).toEqual({ hello: 'friend', foo: 'bar' })

    expect(merge(
      { foo: 'bar', hello: 'friend' }, { hello: 'world', baz: { box: 'bop' } })
    ).toEqual({ hello: 'friend', foo: 'bar', baz: { box: 'bop' } })

    expect(merge(
      { foo: 'bar', hello: 'friend', baz: { fox: 'locks' } }, { hello: 'world', baz: { box: 'bop' } })
    ).toEqual({ hello: 'friend', foo: 'bar', baz: { box: 'bop', fox: 'locks' } })
    expect(merge(
      { foo: 'bar', hello: 'friend', baz: { box: 'pop', fox: 'locks' } }, { hello: 'world', baz: { box: 'bop' } })
    ).toEqual({ hello: 'friend', foo: 'bar', baz: { box: 'pop', fox: 'locks' } })
  })
})
