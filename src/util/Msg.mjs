import c from 'kleur';

class Msg {
  static hr() {
    console.log(c.gray('==================================='));
  }

  static start(msg) {
    console.log(c.gray('==================================='));
    console.log(c.green().bold('START:'), c.white(msg ?? 'step starts'));
  }

  static pass(msg) {
    console.log(c.magenta().bold('PASSED:'), c.white(msg ?? 'step passed'));
  }

  static error(msg) {
    console.log(c.red().bold('ERROR:'), c.white(msg));
  }

  static notice(msg) {
    console.log(c.cyan('***********************************'));
    console.log(c.cyan().bold(` NOTICE: ${msg} `));
    console.log(c.cyan('***********************************'));
  }

  static alert(msg) {
    console.log(c.white('***********************************'));
    console.log(c.yellow().bold(` ALERT: ${msg} `));
    console.log(c.white('***********************************'));
  }

  static end(msg) {
    console.log(c.gray('==================================='));
    console.log(
      c.yellow().bold('DONE:'),
      c.yellow().bold(msg ?? 'all finished'),
    );
  }
}

export default Msg;
