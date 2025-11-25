import sys
import socket
import time
from socketserver import ThreadingMixIn
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler
from ScriptCommand import ScriptCommand

from ScriptSender import ScriptSender

XMLRPC_PORT = 50052
ROBOT_HOST = 'urcontrol-secondary'
SERVER_PORT = 30002

# global sender
sender = None
return_value = None

def setup_socket():
    global sender
    if not sender:
        # Utilize ScriptSender instance to connect socket
        sender = ScriptSender(ROBOT_HOST, SERVER_PORT)
        sender.setup_socket()

def close_socket():
    global sender
    if sender:
        sender.close_socket()
        sender = None

def getResponse():
    return 'Respons works!'
        
def popup(popup_message):
    global sender
    if sender:
        try:
            cmd = ScriptCommand("testScript")
            cmd.setAsSecondaryProgram()
            cmd.appendLine(f"  popup(\"{popup_message}\")")
            sender.send_script_command(str(cmd))
        except socket.error as e:
            print(f"error in sending message: {e}")
        # finally:
        #     close_socket()
    else:
        print("Socket is not ready, first call setup_socket method.")
    

def get_actual_joint_positions():
    global sender
    global return_value
    return_value = None
    if sender:
        try:
            cmd = ScriptCommand("testScript")
            cmd.setAsSecondaryProgram()
            cmd.appendLine("script_com = rpc_factory(\"xmlrpc\",\"http://servicegateway/funh/script-communicator-x/script-communicator-x-backend/xmlrpc/\")")
            cmd.appendLine("pose = get_actual_tcp_pose()")
            # cmd.appendLine("z_value = pose[2]")
            cmd.appendLine("shared var_shar")
            # cmd.appendLine("script_com.set_return_value(z_value)") #uncomment this line to return the z-value
            cmd.appendLine("script_com.set_return_value(var_shar)") #uncomment this line to return the shared variable
            sender.send_script_command(str(cmd))

            # wait 0.01 second
            time.sleep(0.01)

            return return_value
        except socket.error as e:
            print(f"error in sending message: {e}")
            return None
        # finally:
        #     close_socket()
    else:
        print("Socket is not ready, first call setup_socket method.")
        return None

def set_return_value(value):
    global return_value
    return_value = value

def get_return_value():
    return return_value

class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_path = ('/',)

class MultithreadedSimpleXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
	pass

sys.stdout.write("script communicator daemon started")
sys.stderr.write("script communicator daemon started")

server = MultithreadedSimpleXMLRPCServer(("0.0.0.0", XMLRPC_PORT))
server.RequestHandlerClass.protocol_version = "HTTP/1.1"
server.register_function(getResponse, "getResponse")
server.register_function(popup, "popup")
server.register_function(setup_socket, "setup_socket")
server.register_function(close_socket, "close_socket")
server.register_function(set_return_value, "set_return_value")
server.register_function(get_actual_joint_positions, "get_actual_joint_positions")
server.register_function(get_return_value, "get_return_value")
server.serve_forever()

# if __name__ == '__main__':
#     run()
