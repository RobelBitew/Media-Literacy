import os
import string
import nltk
#nltk.download('stopwords')   # you may need to uncomment this
# pip install -U scikit-learn
from nltk.corpus import stopwords
import sklearn
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import numpy as np

def preprocess_texts(folder):
    data = []
    labels = []
    filenames = []
    stop_words = set(stopwords.words('english'))
    for label in ['authoritarian', 'control']:
        folder_path = os.path.join(folder, label)
        for fname in os.listdir(folder_path):
            with open(os.path.join(folder_path, fname), 'r', encoding='utf-8') as f:
                text = f.read().lower()
                # removes all punctuation:
                text = text.translate(str.maketrans('', '', string.punctuation))
                individual_words = text.split()
                filtered_words = []
                for word in individual_words:
                    if word not in stop_words:
                        filtered_words.append(word)
                text = ' '.join(filtered_words)
                data.append(text)
                labels.append(label)
                filenames.append(fname)
    return data, labels, filenames

def feature_extraction(texts, labels, filenames):
    vectorizer = TfidfVectorizer(max_features=1000) # changed from count vectorizer
    #vectorizer = CountVectorizer(max_features=500) # initializes vectorizer
    # we can choose 500 to 2,000 max features to avoid overfitting with only |corpus| = 11
    X = vectorizer.fit_transform(texts) # creates bag-of-(most common)-words
    # ^ this picks the 500 most common words across the entire dataset
    # word & word count
    # X ends up being a matrix = {document, word, count}
    X_normalized = normalize(X, norm='l2') 
    # normalizes using Euclidean norm, which is commonly needed for cosine similarity
    # the normalization makes it so that short speeches and long texts would have ratio-based word counts
    labels_array = np.array(labels) # converts to numpy array
    authoritarian_mean = X_normalized[labels_array == 'authoritarian'].mean(axis=0) 
    # computes average value across authoritarian documents
    control_mean = X_normalized[labels_array == 'control'].mean(axis=0)
    authoritarian_mean = authoritarian_mean.A # makes .toarray()
    control_mean = control_mean.A
    """ authoritarian_sim = cosine_similarity(X_normalized, authoritarian_mean)
    # cosine similarity is the angle or dot product between two vectors
    control_sim = cosine_similarity(X_normalized, control_mean)
    for i in range(len(texts)):
        print(f"{labels[i]} | Authoritarian Similarity: {authoritarian_sim[i][0]:.2f} | Control Similarity: {control_sim[i][0]:.2f} | {filenames[i]}")
 """
    return vectorizer, authoritarian_mean, control_mean

def predict_similarity(vectorizer, authoritarian_mean, control_mean, text):
    #process text
    #run similarity

    from nltk.corpus import stopwords
    stop_words = set(stopwords.words('english'))
    text = text.lower()
    # removes all punctuation:
    text = text.translate(str.maketrans('', '', string.punctuation))
    individual_words = text.split()
    filtered_words = []
    for word in individual_words:
        if word not in stop_words:
            filtered_words.append(word)
    text = ' '.join(filtered_words)


    X_new = vectorizer.transform([text]) # do not use fit_transform because we aren't training
    X_new_normalized = normalize(X_new, norm='l2')
   
    authoritarian_sim = cosine_similarity(X_new_normalized, authoritarian_mean)[0][0]
    control_sim = cosine_similarity(X_new_normalized, control_mean)[0][0]

    
    return authoritarian_sim, control_sim




if __name__ == "__main__": 
    # test preprocess_texts:
    texts, labels, filenames = preprocess_texts("corpus")


    text = "The first piece of good news is that my visit this year was not accompanied by the same kind of brouhaha as last year’s: this year we have not received – I have not received – a diplomatic démarche from Bucharest; what I received was an invitation to a meeting with the Prime Minister, which took place yesterday. Last year, when I had the opportunity to meet the Prime Minister of Romania, I said after the meeting that it was “the beginning of a beautiful friendship”; at the end of the meeting this year, I was able to say “We’re making progress”. If we look at the figures, we are setting new records in economic and trade relations between our two countries. Romania is now Hungary’s third most important economic partner. We also discussed with the Prime Minister a high-speed train – a “TGV” – linking Budapest to Bucharest, as well as Romania’s membership of Schengen. I have undertaken to put this issue on the agenda for the October Justice and Home Affairs Council meeting – and, if necessary, for the December Council meeting – and to take it forward if possible."

    # we should not run this function every time once we have a trained model:
    vectorizer, authoritarian_mean, control_mean = feature_extraction(texts, labels, filenames)
    authoritarian_sim, control_sim = predict_similarity(vectorizer, authoritarian_mean, control_mean, text)

    
    print(f"Authoritarian Similarity: {authoritarian_sim:.2f} | Control Similarity: {control_sim:.2f}")
    

    
    
