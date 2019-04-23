FROM python:3
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python3 get-pip.py
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get update
RUN apt-get install -y nodejs
ENV PATH $PATH:/root/.local/bin
RUN pip3 install awscli --upgrade --user
RUN pip3 install --user aws-sam-cli
