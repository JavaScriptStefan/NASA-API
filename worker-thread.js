const { 
Worker,
workerData,
isMainThread
} = require("worker_threads");

if(isMainThread){
    console.log("Main thread running");
    console.log("process id", process.pid)
    new Worker(__filename, {
        workerData: [7, 1, 3, 2, 6, 5,8, 4]
    });

    new Worker(__filename, {
        workerData: [8, 2, 9, 1, 4]
    });
}else{
    console.log("Worker thread running");
    console.log("process id", process.pid);
    console.log({ workerData })
}