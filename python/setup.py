from setuptools import setup, find_packages

setup(
    name="powerplantsim",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "iapws",
        "PyQt5",
        "pyqtgraph",
        "opencv-python-headless",
    ],
    python_requires=">=3.7",
) 