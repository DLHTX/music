
var EventCenter = {
    on: function(type, handler){
        $(document).on(type, handler)
    },
    fire: function(type, data){
        $(document).trigger(type, data)
    }
}





var main = {
    init:function () {
        this.$main=$('main')
        this.$nextbtn=this.$main.find('.icon-next')
        this.$lastbtn=this.$main.find('.icon-last')
        this.$bigbox=this.$main.find('.img-box2')
        this.bind()
        this.render()
        this.isToend = false
        this.isOK=false
        this.isTostart = false


    },

    bind:function () {
        var _this = this
        _this.$main.find('.img-box3').on('click','.box',function () {
            $(this).siblings().find('.img').removeClass('box-show')
            $(this).find('.img').addClass('box-show')
            window.$img = $(this).find('.img')
            EventCenter.fire('select',{
                channelId: $(this).find('.img').attr('Cid'),
                nameId: $(this).find('.img').attr('Nid'),
            })
        })

        this.$nextbtn.on('click',function () {
            if( _this.isOK) return
            _this.isTostart = false
            $('main .icon-last').show()

            if(_this.$bigbox.width() + parseFloat(_this.$bigbox.css('left'))  <= 2000 ){
                _this.isToend = true
                $('main .icon-next').hide()
            }

                var length = _this.$main.find('.img-box3').width()
                var itemWith = _this.$main.find('.box').outerWidth(true)
                var count = Math.floor(length/itemWith)
                if(!_this.isToend){
                    _this.isOK = true
                    _this.$bigbox.animate({
                        left: '-='+  count * itemWith
                    },400,function () {
                        _this.isOK = false
                    })
           }
        })

        this.$lastbtn.on('click',function () {
            _this.isToend = false
            if( _this.isOK) return
            $('main .icon-next').show()
            var length = _this.$main.find('.img-box3').width()
            var itemWith = _this.$main.find('.box').outerWidth(true)
            var count = Math.floor(length/itemWith)

            if(_this.$bigbox.width() + parseFloat(_this.$bigbox.css('left')) >= _this.$bigbox.width() ){
                _this.isTostart = true
                $('main .icon-last').hide()
            }


            if(!_this.isTostart){
                _this.isOK = true
                _this.$bigbox.animate({
                        left: '+='+  count * itemWith
                    },400,function () {
                    _this.isOK = false
                })
            }

        })
    },

    render:function () {
        var _this=this
        $.ajax({
            url:'//jirenguapi.applinzi.com/fm/getChannels.php',
            type:'GET',
            dataType:'json'
        }).done(function (ret) {
            console.log(ret)
            _this.renderMain(ret)

        }).fail(function () {
            console.log('404')
           
        })
    },

    renderMain:function(ret) {
        ret.channels.forEach(function (channel) {
            var html= `
                <div class="box" >
                <div class="img" style="background:url                    ('img.jpg')"></div>
                <span>我的最爱</span>
                   </div>
                  `
            var $html = $(html)
            $html.find('.img').css({
                background:'url('+ channel.cover_small+')'
            })
            $html.find('.img').attr('Cid',channel.channel_id)
            $html.find('.img').attr('Nid',channel.name)
            $html.find('span').text(channel.name)
            $('main .img-box2').append($html)
        })
        this.setStyle()
    },

    setStyle:function () {
        $('main .img-box2').css({
            width : $('main .box').length *  $('main .box').outerWidth(true) + 'px'
        })



    }
}

main.init()



var app = {
    init:function () {
        this.bind()
        this.$footer = $('footer')
        this.audio = new Audio()
        this.audio.autoplay = true
        this.channelid = 'public_tuijian_rege'
        this.ismove=false

        EventCenter.fire('select',{
            channelId : 'public_tuijian_rege'
        })

    },
    bind:function () {
        var _this = this

        EventCenter.on('select',function (e,channel) {
            _this.channelid = channel.channelId
            _this.channename = channel.nameId

            _this.loadMusic()
        })

        $('footer .song-status').on('click',function () {
            if($(this).hasClass('icon-play')){
                $(this).removeClass('icon-play').addClass('icon-stop')
                _this.audio.play()

            }else{
                $(this).removeClass('icon-stop').addClass('icon-play')
                _this.audio.pause()
            }
        })

        $('footer .icon-qianjin').on('click',function () {
            _this.loadMusic()
        })

        $('footer .icon-houtui').on('click',function () {
            _this.loadMusic()
        })

        document.querySelector('footer .progress-time').addEventListener('click',function (e) {
            var per = e.offsetX/$('footer .progress-time').width()
            console.log(per)
            $('footer .current-time').css({
                width:per  * 100 + '%'
            })
            _this.audio.currentTime = _this.audio.duration * per
            console.log( _this.audio.currentTime )
        })

        document.querySelector('footer .icon2 span').addEventListener('click',function (e) {
            var per = e.offsetX
            $('footer .icon2 .volume').css({
                width:per  +'%'
            })

            _this.audio.volume = per / 100 * 1
            console.log( _this.audio.volume)

            if(_this.audio.volume < 0.5){
                $('footer .icon2 .iconfont').removeClass('icon-kai').addClass('icon-guan')
            }else{
                $('footer .icon2 .iconfont').removeClass('icon-guan').addClass('icon-kai')
            }

        })





             $(document).on('mousemove',function () {
                 console.log('move')
                 this.ismove = true
                 if(this.ismove == true){
                     clearInterval(interC)
                     this.ismove = false
                     _this.In()
                 }
                 if(this.ismove == false){
                     interC = setInterval(function () {
                         console.log('11')
                         _this.Out()
                     },5000)
                 }

             })


            if(this.ismove == false){
                var interC = setInterval(function () {
                   _this.Out()
                },5000)
            }
    },
    loadMusic:function () {
        var _this = this
        $.ajax({
            url:'//jirenguapi.applinzi.com/fm/getSong.php',
            type:'GET',
            dataType:'json',
            data:{
                channel:_this.channelid
            }
        }).done(function (ret) {
            _this.setMusic(ret.song[0])

        }).fail(function () {
            _this.loadMusic()
            console.log('404')
        })
    },
    setMusic:function (song) {
       var _this = this
        this.song = song
        this.$footer.find('.songer-img').css('background-image','url('+song.picture +')')
        this.$footer.find('.song-name').text(song.title)
        this.$footer.find('.art-name').text(song.artist)
        $('main .song-title').text( this.channename)
        this.audio.src = song.url
        $('footer .song-status').removeClass('icon-play').addClass('icon-stop')
        this.audio.addEventListener('play',function(){
            clearInterval(_this.Clock)
            _this.Clock = setInterval(function () {
                _this.upData()
            },1000)

        })

        this.audio.addEventListener('pause',function(){
            clearInterval(_this.Clock)
        })
        _this.getLyric()


        this.audio.addEventListener('ended',function(){
           _this.loadMusic()

        })




    },
    upData:function () {
        $('footer .current-time').css({
            width: this.audio.currentTime/this.audio.duration * 100 + '%'
        })

        var min = '0' + Math.floor(this.audio.currentTime/60)
        var sec = Math.floor(this.audio.currentTime)%60 + ''
        sec = sec.length == 2 ? sec : '0' + sec
        var line = this.lyric[min + ':' + sec]
            if(line){
                $('footer .lyic').text(this.lyric[min + ':' + sec]).boomText()
                $('body .lyic2').text(this.lyric[min + ':' + sec]).boomText()
            }

    },

    getLyric:function () {
        var _this = this
        $.ajax({
            url: '//jirenguapi.applinzi.com/fm/getLyric.php',
            type: 'GET',
            dataType: 'json',
            data: {
                sid: this.song.sid
            }
        }).done(function (ret) {
            _this.setLyric(ret.lyric)
        })
    },
    setLyric:function (Lyric) {
       _this = this

        var lyric = {}
        Lyric.split('\n').forEach(function (line) {
            var timeArry  = line.match(/\d{2}:\d{2}/g)
            if(timeArry){
                timeArry.forEach(function (time) {
                    lyric[time] = line.replace( /\u9965\u4eba\u8c37|\[.+?\]|(by)|,/g , '')
                })

            }
            _this.lyric = lyric
            })



    },
    In:function () {
        $('footer').removeClass('animated fadeOut').addClass('animated fadeIn')
        $('body .lyic2').css({
            opacity:0
        }).removeClass('animated fadeIn').addClass('animated fadeOut')
        $('main .icon-box').removeClass('animated fadeIn').addClass('animated bounceIn').css({
            width:100 + 'vh',
            left: 'calc(50% - 50vh)'
        })

    },
    Out :function () {
        $('footer').removeClass('animated fadeIn').addClass('animated fadeOut')


        $('body .lyic2').css({
            opacity:1
        }).removeClass('animated fadeOut').addClass('animated fadeIn')
        $('main .icon-box').removeClass('animated bounceIn').addClass('animated fadeIn').css({
            width:100+'%',
            left:0
        })
    },

    
}

$.fn.boomText = function(){
    this.html(function(){
        var arr = $(this).text()
            .split('').map(function(word){
                return '<span class="boomText">'+ word + '</span>'
            })
        return arr.join('')
    })

    var index = 0
    var $boomTexts = $(this).find('span')
    var clock = setInterval(function(){
        $boomTexts.eq(index).addClass('red')
        index++
        if(index >= $boomTexts.length){
            clearInterval(clock)
        }
    }, 300)
}


app.init()





