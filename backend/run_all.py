import os
import subprocess

def run_all_scripts():
    backend_folder = os.path.dirname(os.path.abspath(__file__))  # Get the current folder
    python_files = [f for f in os.listdir(backend_folder) if f.endswith(".py") and f != "run_all.py"]

    processes = []  # List to store subprocesses

    # Start all Python files in the backend folder
    for file in python_files:
        print(f"Starting {file}...")
        try:
            process = subprocess.Popen(["python", os.path.join(backend_folder, file)])
            processes.append((file, process))
        except Exception as e:
            print(f"Error while starting {file}: {e}")

    # Start server.js (Node.js process)
    try:
        print("Starting server.js...")
        server_process = subprocess.Popen(["node", os.path.join(backend_folder, "server.js")])
        processes.append(("server.js", server_process))
    except Exception as e:
        print(f"Error while starting server.js: {e}")

    # # Start the frontend (npm run dev)
    # frontend_folder = os.path.abspath(os.path.join(backend_folder, "../frontend"))
    # try:
    #     print("Starting frontend (npm run dev)...")
    #     frontend_process = subprocess.Popen(["npm", "run", "dev"], cwd=frontend_folder, shell=True)
    #     processes.append(("frontend (npm run dev)", frontend_process))
    # except Exception as e:
    #     print(f"Error while starting frontend: {e}")

    # Wait for all processes to complete
    for name, process in processes:
        try:
            process.wait()
            print(f"{name} finished running.")
        except Exception as e:
            print(f"Error while waiting for {name} to finish: {e}")

if __name__ == "__main__":
    run_all_scripts()