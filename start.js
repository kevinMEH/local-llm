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

if(process.argv.includes("--dev")) {
    spawnPromise("python", ["main.py"], {
        stdio: "inherit", shell: true
    });
    spawnPromise("npm", ["run", "dev"], {
        stdio: "inherit", shell: true
    });
} else {
    if(false == existsSync("./.next/BUILD_ID") || process.argv.includes("--build")) {
        console.log("Compiling...");
        await spawnPromise("npm", ["run", "build"], {
            stdio: "inherit", shell: true
        });
    }
    
    spawnPromise("python", ["main.py", "--production"], {
        stdio: "inherit", shell: true
    });
    spawnPromise("npm", ["run", "start"], {
        stdio: "inherit", shell: true
    });
}
