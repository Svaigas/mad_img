# mad_img
API to upload images to AMAZON S3 and saving link, id and parameters on mongoDB

## Instalation guide  
####Installing on localhost 
1. Have to set three environment variables :
```
AWS_ACCESS_KEY_ID
```
,
```
AWS_SECRET_ACCESS_TOKEN
```
,
```
MAD_IMG_BUCKET
```,
```
MAD_IMG_MONGO
```


mad.img.bucket is a bucket name, where images will be upload. mad.img.mongo is a mongodb address, where images will be upload, collection name should be created and name 'images': f.e. mongodb://localhost:27017/madimg.
2. Wget project from github: ```https://github.com/Svaigas/mad_img.git```
3. Go to directory, where you download zip, unpack and do : ```npm install```
4. Run by using command :```npm run```


####Installing using Dockerfile
-- TBD

## How to call API
POSTMAN call example

![](https://raw.githubusercontent.com/Svaigas/mad_img/master/docs/Request1.JPG?token=AZqEMWJwRa3TvEyTnCbrB08p4EsvdBLdks5Y9dJkwA%3D%3D)

Data is returned in JSON format. Sample below:

	[{"url":"https://mad.img.bucket.s3.amazonaws.com/rkokvf9ag_320_640.jpg","width":320,"height":640,"_id":"58ec96e2496a280cb814036c"},{"url":"https://mad.img.bucket.s3.amazonaws.com/rkokvf9ag_600_600.jpg","width":600,"height":600,"_id":"58ec96e2496a280cb814036d"}]



