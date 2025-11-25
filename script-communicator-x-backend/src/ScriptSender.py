import socket
import threading


class ScriptSender:
    def __init__(self, robot_host='urcontrol-secondary', server_port=30002):
        self.robot_host = robot_host
        self.server_port = server_port
        self.client_socket = None
        self.lock = threading.Lock()

    def setup_socket(self):
        
        if self.client_socket:  # already connected
            return True
        
        try:
            self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server_address = (self.robot_host, self.server_port)
            self.client_socket.connect(server_address)
            print("[Sender] Socket connection successful.")
            return True
        except ConnectionRefusedError:
            print("[Sender] Cannot connect to server, ensure Server is running on the port.")
            self.client_socket = None
            return False
        except socket.gaierror as e:
            print(f"[Sender] server address incorrect: {e}")
            self.client_socket = None
            return False
        except socket.error as e:
            print(f"[Sender] Socket error: {e}")
            self.client_socket = None
            return False

    def close_socket(self):
        if self.client_socket:
            try:
                self.client_socket.close()
                print("[Sender] Socket connection closed.")
                self.client_socket = None
            except socket.error as e:
                print(f"[Sender] Error when trying to close Socket connection: {e}")
        else:
            print("[Sender] Socket connection is not available, no need to close.")

    def send_script_command(self, command):
        with self.lock:  
            # lock the socket to prevent multiple threads from sending commands at the same time
            if self.client_socket:
                try:
                    self.client_socket.sendall(command.encode('utf-8'))
                    print(f"[Sender] send off: {command}")
                except socket.error as e:
                    print(f"[Sender] Error when sending command: {e}")
            else:
                print("[Sender] Socket connection is not available, first call method setup_socket.")

    def is_connected(self):
        if not self.client_socket:
            return False
        try:
            self.client_socket.getpeername()
            return True
        except:
            return False