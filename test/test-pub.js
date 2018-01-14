const runCmd = require('../lib/runCmd');

function publish(tagString, done) {
  let args = ['publish'];
  if (tagString) {
    args = args.concat(['--tag', tagString]);
  }
  const publishNpm = 'npm';
  runCmd(publishNpm, args, (code) => {
    // tag();
    done(code);
  });
}

publish();
