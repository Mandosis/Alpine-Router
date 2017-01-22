import test from 'ava'

async function fn() {
  return Promise.resolve('foo')
}

test(async (t) => {
  t.is(await fn(), 'foo');
});