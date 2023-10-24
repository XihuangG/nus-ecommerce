import pickle
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def trainData():
    df = pd.read_csv('datasets/ratings_Electronics.csv').head(5000)
    df.columns = ['user_id', 'prod_id', 'rating', 'timestamp']
    df = df.drop('timestamp', axis=1)
    popular_products = pd.DataFrame(df.groupby('prod_id')['rating'].count().reset_index())
    most_popular = popular_products.sort_values('rating', ascending=False)
    df_user_index = df.groupby(['user_id']).count().reset_index()
    print(df_user_index)
    with open('user_index.pickle', 'wb') as handle1:
        pickle.dump(df_user_index, handle1, protocol=pickle.HIGHEST_PROTOCOL)
    with open('product_rating.pickle', 'wb') as handle1:
        pickle.dump(most_popular, handle1, protocol=pickle.HIGHEST_PROTOCOL)
    matrix = df.pivot(index='user_id', columns='prod_id', values='rating').fillna(0)
    matrix['user_index'] = np.arange(0, matrix.shape[0])
    matrix.set_index(['user_index'], inplace=True)
    with open('rating_matrix.pickle', 'wb') as handle1:
        pickle.dump(matrix, handle1, protocol=pickle.HIGHEST_PROTOCOL)

def similar_users(user_index):
    similarity = []
    with open('rating_matrix.pickle', 'rb') as handle:
        interactions_matrix = pickle.load(handle)
    for user in range(0, interactions_matrix.shape[0]):
        sim = cosine_similarity([interactions_matrix.loc[user_index]], [interactions_matrix.loc[user]])

        # Appending the user and the corresponding similarity score with user_id as a tuple
        similarity.append((user, sim))

    similarity.sort(key=lambda x: x[1], reverse=True)
    most_similar_users = [tup[0] for tup in similarity]  # Extract the user from each tuple in the sorted list
    similarity_score = [tup[1] for tup in
                        similarity]  ##Extracting the similarity score from each tuple in the sorted list

    # Remove the original user and its similarity score and keep only other similar users
    most_similar_users.remove(user_index)
    similarity_score.remove(similarity_score[0])

    return most_similar_users, similarity_score


def recommendations(user_index, num_of_products):
    with open('rating_matrix.pickle', 'rb') as handle:
        interactions_matrix = pickle.load(handle)
    with open('user_index.pickle', 'rb') as handle:
        index = pickle.load(handle)
    user_index_df = index[index['user_id'] == 'AZZMV5VT9W7Y8']
    user_index = user_index_df['user_id'].index.values[0]
    # Saving similar users using the function similar_users defined above
    most_similar_users = similar_users(user_index)[0]
    # Finding product IDs with which the user_id has interacted
    prod_ids = set(list(interactions_matrix.columns[np.where(interactions_matrix.loc[user_index] > 0)]))
    recommendations = []

    observed_interactions = prod_ids.copy()
    for similar_user in most_similar_users:
        if len(recommendations) < num_of_products:

            # Finding 'n' products which have been rated by similar users but not by the user_id
            similar_user_prod_ids = set(
                list(interactions_matrix.columns[np.where(interactions_matrix.loc[similar_user] > 0)]))
            recommendations.extend(list(similar_user_prod_ids.difference(observed_interactions)))
            observed_interactions = observed_interactions.union(similar_user_prod_ids)
        else:
            break

    return recommendations[:num_of_products]

def recom(userid, max_no):
    recomend = []
    with open('user_index.pickle', 'rb') as handle:
        user_index = pickle.load(handle)
    if (userid not in user_index['user_id'].values):
        with open('product_rating.pickle', 'rb') as handle:
            product = pickle.load(handle)
        for i in range(max_no):
            recomend.append(product['prod_id'].values[i])
        return recomend
    else:
        return recommendations(userid,10)
