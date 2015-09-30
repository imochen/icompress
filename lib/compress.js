'use strict';

var Imagemin = require('imagemin');
var	imageminPngquant = require('imagemin-pngquant');
var	imageminMozjpeg = require('imagemin-mozjpeg');
var	imageminGifsicle = require('imagemin-gifsicle');
var Q = require('q');
var	path = require('path');
var fs = require('fs');



var getFileSize = function( path ){

	var deferred = Q.defer();

	fs.stat( path , function( err , stat){
		if( err ){
			deferred.reject( err );
		}else{
			deferred.resolve( stat );
		}
	});

	return deferred.promise;

}

function Compress( type , src , dest ){

	this.type = type;
	this.src = src;
	this.dest = dest;

}

Compress.prototype.run = function(){

	var deferred = Q.defer();
	var imagemin = Imagemin();

	imagemin.src( this.src ).dest( this.dest );


	if( this.type === 'png' ){
		imagemin.use( imageminPngquant({quality: '65-80', speed: 5 }));
	}

	if( this.type === 'jpg' ){
		imagemin.use( imageminMozjpeg({quality: 80}));
	}

	if( this.type === 'gif' ){
		imagemin.use( imageminGifsicle({interlaced: true}));
	}

	imagemin.run(function( err , file){
		if( err ){
			deferred.reject( err );
		}else{
			deferred.resolve( file[0].path );
		}
	});

	return deferred.promise;

}



module.exports = function( src , dest){

	var deferred = Q.defer();

	var matches = src.match(/.(gif|png|jpg)$/);

	var res = {};

	if( typeof dest === 'undefined'){
		dest = path.dirname( src );
	}

	if( matches === null ){
		deferred.reject('unknowed format!');
		return false;
	}

	getFileSize( src ).then(function( stat ){
		res.original = stat.size;
		return new Compress( matches[1] , src , dest ).run();

	}).then(function( src ){
		
		res.src = src;
		return getFileSize( src );

	}).then(function( stat){

		res.result = stat.size;
		deferred.resolve( res );

	}).catch( function( err ){

		deferred.reject( err );

	})

	return deferred.promise;
}