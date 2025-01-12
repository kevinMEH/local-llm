import { spawn as __spawn } from "child_process";
import { existsSync } from "fs";

/**
 * @param  {Parameters<__spawn>} args 
 */
function spawnPromise(...args) {
    return new Promise(resolve => {
        const child = __spawn(...args);
        child.on("close", () => {
            resolve();
        });
        child.on("error", error => {
            console.log("Encountered an error while spawning:");
            console.log("Args:", JSON.stringify(args));
            console.log("Error:", error);
        });
    });
}

const windows = process.platform === "win32";
const npmCommand = windows ? "npm.cmd" : "npm";
const pythonCommand = windows ? "python.cmd" : "python";

if(process.argv.includes("--dev")) {
    spawnPromise(pythonCommand, ["main.py"], {
        stdio: "inherit"
    });
    spawnPromise(npmCommand, ["run", "dev"], {
        stdio: "inherit"
    });
} else {
    if(false == existsSync("./.next/BUILD_ID") || process.argv.includes("--build")) {
        console.log("Compiling...");
        await spawnPromise(npmCommand, ["run", "build"], {
            stdio: "inherit"
        });
    }
    
    spawnPromise(pythonCommand, ["main.py", "--production"], {
        stdio: "inherit"
    });
    spawnPromise(npmCommand, ["run", "start"], {
        stdio: "inherit"
    });
}
