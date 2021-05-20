from setuptools import find_packages, setup

extras = {
    "testing": ["pytest", "pytest-xdist"]
}

setup(
    name="platiagro",
    version="0.0.1",
    author="Fabio Beranizo Lopes",
    author_email="fabio.beranizo@gmail.com",
    description="Deploy PlatIAgro on Google Cloud.",
    license="Apache",
    url="https://github.com/platiagro/deployment",
    packages=[],
    install_requires=[
        # WSGI server
        "Flask==1.1.1",
        "Flask-Cors==3.0.8",
        # for making requests over HTTPS
        "requests==2.22.0",
        # YAML parser and emitter
        "pyyaml==5.4",
    ],
    extras_require=extras,
    python_requires=">=3.5.0",
    classifiers=[
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
)