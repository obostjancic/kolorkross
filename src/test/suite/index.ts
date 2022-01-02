import * as path from "path";
import { runCLI } from "jest";

const jestTestRunnerForVSCodeE2E: any = {
  run(testsRoot: string, reportTestResults: (error: Error | undefined, failures?: number) => void): void {
    const projectRootPath = process.cwd();
    console.log(projectRootPath);
    const config = path.join(projectRootPath, "jest.e2e.config.js");
    console.log(config)
    runCLI({ config } as any, [projectRootPath])
      .then(jestCliCallResult => {
        console.log('then');
        console.log('cli res',jestCliCallResult);

        reportTestResults(undefined, jestCliCallResult.results.numFailedTests);
      })
      .catch(errorCaughtByJestRunner => {
                console.log('catch');

        reportTestResults(errorCaughtByJestRunner, 0);
      });
  },
};

module.exports = jestTestRunnerForVSCodeE2E;
