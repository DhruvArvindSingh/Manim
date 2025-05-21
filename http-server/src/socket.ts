import { Server } from "socket.io";
import dotenv from "dotenv";

let idle_machine: string[] = [];
let working_machine: string[] = [];
let requested_machine: string[] = [];
let requested_work: any[] = [];
let work_queue: any[] = [];

dotenv.config();

const PORT = parseInt(process.env.SOCKET_SERVER_PORT || "3001");
const io = new Server(PORT);
console.log("Socket server is running on port", PORT);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("join_server", (status: string) => {
        console.log("join server called");
        status === "idle" ? idle_machine.push(socket.id) : working_machine.push(socket.id);
        if (work_queue.length > 0 && idle_machine.length > 0) {
            add_work(work_queue.pop());
        }
    })
    socket.on("error", (error: Error) => {
        console.log("error called:", error);
    })
    socket.on("update_status", (status: string) => {
        if (status === "idle") {
            if (idle_machine.includes(socket.id) == false) {
                idle_machine.push(socket.id);
            }
            if (working_machine.includes(socket.id)) {
                working_machine = working_machine.filter(m => m !== socket.id);
            }
            if (work_queue.length > 0 && idle_machine.length > 0) {
                add_work(work_queue.pop());
            }
        }
        else if (status === "working") {
            if (working_machine.includes(socket.id) == false) {
                working_machine.push(socket.id);
            }
            if (idle_machine.includes(socket.id) == true) {
                idle_machine = idle_machine.filter(m => m !== socket.id);
            }
        }
    })
    socket.on("work_status", (status: string) => {
        let prompt: string = "";
        if (status === "accepted") {
            requested_machine = requested_machine.filter(m => m !== socket.id);
            requested_work = requested_work.filter(w => w.machine_id !== socket.id);
        }
        else if (status === "error") {
            requested_machine = requested_machine.filter(m => m !== socket.id);
            requested_work = requested_work.filter(w => {
                if (w.machine_id === socket.id) {
                    prompt = w.prompt;
                    return false;
                }
                return true;
            });
            prompt && add_work(prompt);
        }
    })
});

function add_work(prompt: string) {
    if (idle_machine.length > 0) {
        let socket_id = idle_machine.pop();
        if (socket_id) {
            requested_machine.push(socket_id);
            requested_work.push({
                "machine_id": socket_id,
                "prompt": prompt,
            });
            io.to(socket_id).emit("work", {
                "machine_id": socket_id,
                "prompt": prompt,
            });
        }
    }
    else {
        work_queue.push(prompt);
    }
}

export default add_work;
