$(document).ready(function() {
 
 function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
  const endpoint = `https://xe5a-injf-5wxp.n7.xano.io/api:z9NOXVAQ/api_get_scrape_reviews`;
   var grid = document.querySelector('#grid');
		Swal.fire({
    	title:'Loading',
      timerProgressBar: true,
      didOpen: () => {
      Swal.showLoading()
      }
    })
    var items = new Array();
    var colours = ['#96e9cf','#e8d1e8','#eaeaea','#f5f9fc'];
    var coloursShort = ['#007450','#95337a','#171a22','#95337a'];
    fetch(endpoint)
    .then(res => res.json())
		.then(jsons => {
      Swal.close();
     
     let myarray =  _.orderBy(jsons, function(o) {
        return new Date(o.review_date)
     },['desc']);
     
     console.log(myarray)

    	myarray.map((post)=> {
      let fullname = post.review_user;
      let fullnameArray = fullname.split(' ');
      let shortName;
      console.log(fullnameArray);
      if(fullnameArray.length <=1) {
      shortName = fullnameArray[0].charAt(0);
      }else {
      let fnC = fullnameArray[0].charAt(0);
      let lnC = fullnameArray[1].charAt(0);
      shortName = `${fnC}${lnC}`;
      }
      var randNumber = getRandomInt(0,3);
      
      var randomColor = colours[randNumber];
      var shortColor = coloursShort[randNumber];
      //var randomColor = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
      var imgSrc;
      var imgWidth;
      var imgAlt;
      if(post.review_platform === 'G2') {
      	imgSrc =`https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/638464b78c40a74cdc9b4d2e_g2.webp`;
      	imgWidth = 30
        imgAlt = 'G2 reviews'
      }else if(post.review_platform === 'trustpilot') {
      	imgSrc = `https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/62344d8e6237000e058d037e_trustpilot%20(1).png`;
      	imgWidth = 80
        imgAlt = 'Trustpilot reviews'
      } else {
      	imgSrc = `https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/60e439b8e0c58b73e54968e7_logo%25402x-p-500.png`;
      	imgWidth = 80
        imgAlt = 'Startfleet reviews'
      }
      //var randomColor = Math.floor(Math.random()*16777215).toString(16);
       let item = document.createElement('article');
    	let profile = `<div class="div-block-6">
      <div class="div-block-13 div-block-14" style="background-color:${shortColor}">
      <div class="text-block-57 custom-color-white">${shortName.toUpperCase()}</div>
      </div>
      <div id="w-node-_804547d8-3a61-a817-465b-37e4ab63d45a-b1e06150" class="div-block-7"><div>`;
      if(post.review_platform!=='manual') {
      profile+=`<a href="${post.review_user_link}" target="_self">
      <strong class="bold-text-17">${post.review_user}</strong></a>`;
      }else {
      profile+= `<strong class="bold-text-17">${post.review_user}</strong></a>`;
      }
      profile+=`</div>
      </div>
      </div>`;
      let img ;
      if(post.review_rating === "5" || post.review_rating == 5.0) {
      img = `<img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/6215e337569c1e29ddcbd813_stars-5.svg" loading="lazy" width="100" alt="" class="image-54">`;
      } else if(post.review_rating === "4" || post.review_rating == 4.0) {
      img = `<img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/6396f6165cf3b1a2b07ddb25_4-star.png" loading="lazy" width="80" alt="" class="image-54">`;
      
      } else if(post.review_rating === "3" || post.review_rating == 3.0) {
      
      img = `<img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/6396f61510c582528bf040d7_3-star.png" loading="lazy" width="60" alt="" class="image-54">`;
      } else if (post.review_rating === "2" || post.review_rating == 2.0) {
      img = `<img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/6396f615c92e133b3aa9f668_2-star.png" loading="lazy" width="40" alt="" class="image-54">`;
      } else {
      img = `<img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/6396f6159311672cbe493ad9_1-star.png" loading="lazy" width="20" alt="" class="image-54">`;
      }
      
			 let bottom = `<div class="w-layout-grid grid-8"><div id="w-node-dbac72b4-30dd-550a-45f4-2637fb25e92a-b1e06150" class="country-name"><img src="https://uploads-ssl.webflow.com/60e439b8e0c58b64b4496671/62191431f13ea620419c665f_location.png" loading="lazy" width="20" height="20" alt="" class="image-59"><div class="text-block-54">Thailand</div></div><div id="w-node-dbac72b4-30dd-550a-45f4-2637fb25e92e-b1e06150" class="div-block-8"><div class="text-block-56">reviewed on</div>`;
       if(post.review_platform !== 'manual') {
        bottom+= `<a href="${post.review_link}" target="_blank" class="image-link w-inline-block">
      <img src="${imgSrc}" loading="lazy" width="${imgWidth}" alt="${imgAlt}" class="image-52"></a>`;
     
       }else {
        bottom+= `
      <img src="${imgSrc}" loading="lazy" width="${imgWidth}" alt="${imgAlt}" class="image-52">`;
     
       }
      
      bottom+=`</div>
       </div>`;
       
       let publishDate = `<div class="w-layout-grid grid-8 bold-text-12">
       <div>Date of Experience: </div>
       <div>${post.review_date}</div>
       </div>`;
       if(post.review_type === 'text') {
       item.innerHTML = profile + 
       `<div>${img}</div>` + 
       '<p class="text-normal">'+
       post.review_text+
       '</p>' + 
       publishDate +
       bottom;
       } else {
        item.innerHTML = profile + 
       `<div>${img}</div>` + 
       '<br><div class="video-normal">'+
       `
       <div style="padding: 177.75% 0 0 0; position: relative">
       <div style="height:100%;left:0;position:absolute;top:0;width:100%">
       <iframe height="100%" width="100%;" style="border-radius:16px;" 
       src="${post.review_video_link}" frameborder="0" allow="autoplay; fullscreen" scrolling="no">
       </iframe>
       </div>
       </div>`+
 
       '</div>' + 
       publishDate +
       bottom;
       
       }
       //item.style.backgroundColor = "#" + randomColor;
       item.style.backgroundColor = randomColor;
       items.push(item);
      
      })
      salvattore.appendElements(grid, items);
    })
   
    
	});