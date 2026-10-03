# Fake Review Detector

[![Live site](https://img.shields.io/badge/Website-Github_Pages-D57027?logo=githubpages)](https://rugvedb133.github.io/fake-review-detector/)
[![IEEE ICCCA 2020](https://img.shields.io/badge/IEEE-ICECCT_2021-00629B?logo=ieee&logoColor=white)](https://doi.org/10.1109/ICECCT52121.2021.9616697)

Detecting fake hotel reviews with Natural Language Processing and a booking check.

This was a capstone project developed by a team of three.
We trained a classifier to flag deceptive hotel reviews,
then put it behind a small Flask app that checks
a reviewer's booking before the model ever sees the review.

**Live write-up:** https://rugvedb133.github.io/fake-review-detector/

## Highlights

- Trained on a corpus of ~1,600 hotel reviews
- Text cleaned with regex, lemmatized with WordNet, and vectorized with TF-IDF over n-grams
- Compared five classifiers across six n-gram settings.

## Built with

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![pandas](https://img.shields.io/badge/pandas-150458?logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white)
![NLTK](https://img.shields.io/badge/NLTK-2D2D2D?logo=pypi&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikitlearn&logoColor=white)
![XGBoost](https://custom-icon-badges.demolab.com/badge/XGBoost-2E5D85?logo=xgboost-logo&logoColor=fff)
![Matplotlib](https://custom-icon-badges.demolab.com/badge/Matplotlib-1f77b4?logo=matplotlib&logoColor=fff)
![Seaborn](https://custom-icon-badges.demolab.com/badge/Seaborn-4EAEAA?logo=seaborn&logoColor=fff)
![Flask](https://img.shields.io/badge/Flask-bdddeb?logo=flask&logoColor=53a9d1)
![Google Colab](https://img.shields.io/badge/Google_Colab-F9AB00?logo=googlecolab&logoColor=white)


## Publication

This work was later published as:

> "A Review-and-Reviewer based approach for Fake Review Detection",
> *2021 Fourth International Conference on Electrical, Computer and Communication Technologies (ICECCT)*, 2021, pp. 1-6.
> doi: [10.1109/ICECCT52121.2021.9616697](https://doi.org/10.1109/ICECCT52121.2021.9616697)

## About this repository

The source code for this project isn't published, so this repo only holds the write-up website.
It is served from the [`gh-pages`](../../tree/gh-pages) branch.
[`main`](../../tree/main) branch holds only this README.

## Dataset

The review data comes from:

- "Finding Deceptive Opinion Spam by Any Stretch of the Imagination", *49th Annual Meeting of the Association for Computational Linguistics*, 2011, pp. 309–319. [aclanthology.org/P11-1032](https://aclanthology.org/P11-1032/)
- "Negative Deceptive Opinion Spam", *2013 Conference of the North American Chapter of the Association for Computational Linguistics*, 2013, pp. 497–501. [aclanthology.org/N13-1053/](https://aclanthology.org/N13-1053/)

## Related

The same project was reused for a startup role-play in a Technology
Entrepreneurship course: https://sites.google.com/spit.ac.in/fidelity-tech