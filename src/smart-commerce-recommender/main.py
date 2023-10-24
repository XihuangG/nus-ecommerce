from flask import Flask, Response, json, jsonify
from service import dataTrainer

app = Flask(__name__)

@app.route('/recommend/<user_id>', methods = ['GET'])
def recommend(user_id):
    return jsonify(dataTrainer.recom(user_id,10))

@app.route('/trigger/train', methods = ['GET'])
def train():
    return dataTrainer.trainData()

if __name__ == '__main__':
    app.run()