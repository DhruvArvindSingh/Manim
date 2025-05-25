import { Server } from "socket.io";
import dotenv from "dotenv";

let idle_machine: string[] = [];
let working_machine: string[] = [];
let requested_machine: string[] = [];
let requested_work: any[] = [];
let work_queue: any[] = [];

dotenv.config();

const PORT = parseInt(process.env.SOCKET_SERVER_PORT || "3001");
const io = new Server(PORT, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});
console.log("Socket server is running on port", PORT);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("rejoin_server");
    socket.on("join_server", (status: string) => {
        console.log("join server called with status:", status);
        status === "idle" ? idle_machine.push(socket.id) : working_machine.push(socket.id);
        if (work_queue.length > 0 && idle_machine.length > 0) {
            const w = work_queue.pop();
            add_work(w.prompt, w.slug);
        }
    })
    socket.on("error", (error: Error) => {
        console.log("error called:", error);
    })
    socket.on("update_status", (status: string) => {
        console.log("update status called with status:", status);
        console.log("BEFORE idle machine:", idle_machine);
        console.log("BEFORE working machine:", working_machine);
        if (status === "idle") {
            if (idle_machine.includes(socket.id) == false) {
                idle_machine.push(socket.id);
            }
            if (working_machine.includes(socket.id)) {
                working_machine = working_machine.filter(m => m !== socket.id);
            }
            if (work_queue.length > 0 && idle_machine.length > 0) {
                const w = work_queue.pop();
                add_work(w.prompt, w.slug);
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
        console.log("AFTER idle machine:", idle_machine);
        console.log("AFTER working machine:", working_machine);
    })
    socket.on("work_status", (status: string) => {
        console.log("work status called with status:", status);
        let prompt: string = "";
        let slug: string = "";
        console.log("BEFORE requested machine:", requested_machine);
        console.log("BEFORE requested work:", requested_work);
        if (status === "accepted") {
            requested_machine = requested_machine.filter(m => m !== socket.id);
            requested_work = requested_work.filter(w => w.machine_id !== socket.id);
        }
        else if (status === "error") {
            requested_machine = requested_machine.filter(m => m !== socket.id);
            requested_work = requested_work.filter(w => {
                if (w.machine_id === socket.id) {
                    prompt = w.prompt;
                    slug = w.slug;
                    return false;
                }
                return true;
            });
            prompt && slug && add_work(prompt, slug);
        }
        console.log("AFTER requested machine:", requested_machine);
        console.log("AFTER requested work:", requested_work);
    })
    socket.on("disconnect", () => {
        console.log("a user disconnected");
        if (idle_machine.includes(socket.id)) {
            idle_machine = idle_machine.filter(m => m !== socket.id);
        }
        if (working_machine.includes(socket.id)) {
            working_machine = working_machine.filter(m => m !== socket.id);
        }
    })
});

function add_work(prompt: string, slug: string, rerun: boolean = false) {
    console.log("add work called with prompt:", prompt, "and slug:", slug);
    if (idle_machine.length > 0) {
        console.log("idle machine found, popping one with id:", idle_machine[idle_machine.length - 1]);
        let socket_id = idle_machine.pop();
        console.log("socket id:", socket_id);
        if (socket_id) {

            requested_machine.push(socket_id);
            console.log("requested machine:", requested_machine);
            requested_work.push({
                "slug": slug,
                "machine_id": socket_id,
                "prompt": prompt,
            });
            console.log("requested work:", requested_work);
            io.to(socket_id).emit("work", {
                "prompt": prompt,
                "slug": slug,
                "rerun": rerun,
            });
            console.log("work emitted to socket id:", socket_id);
        }
    }
    else {
        work_queue.push({
            "prompt": prompt,
            "slug": slug,
        });
    }
}

export default add_work;
