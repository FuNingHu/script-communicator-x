FROM python:3.11-alpine

WORKDIR /usr/src/app

# # copy dependancy
# COPY requirements.txt ./

# # install python dependancy
# RUN pip install --no-cache-dir -r requirements.txt

# copy application code
COPY src/ .

# Set ENV Variable
ENV PYTHONPATH="${PYTHONPATH}:/usr/src/app"

# 暴露端口
EXPOSE 50052

# 启动命令
ENTRYPOINT [ "python", "-u", "script-communicator-daemon.py" ]