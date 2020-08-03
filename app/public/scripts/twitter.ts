const OneMin = 1000 * 60
const OneHour = OneMin * 60
const OneDay =  OneHour * 24
const limit = 4
const eachLine = 1


const blockBannerImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAADICAYAAAA0n5+2AAADpUlEQVR4nO3WMQHAIBDAwKf+pTGzoaWYyHgnIVPWPvcfAAAyn5QAAC2DBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAADGDBQAQM1gAAKWZeSmkBQ6wJmd6AAAAAElFTkSuQmCC`
class twitter {
    public text_following = ['正在关注','フォロー中','Following','個跟隨中']
    public text_follower = ['个关注者','フォロワー','Followers','位跟隨者']
    public retweeted = ['转推了','さんがリツイート','Retweeted','已轉推']
    public joinedText = ['','','Joined','']
    public twitterTimeArray = null
    public showTimeData = [
        dataTimeString => {
            return this.getTime ( dataTimeString, 0 )
        },
        dataTimeString => {
            return this.getTime ( dataTimeString, 1 )
        },
        dataTimeString => {
            return this.getTime ( dataTimeString, 2 )
        },
        dataTimeString => {
            return this.getTime ( dataTimeString, 3 )
        },
    ]

    public showUserTimeData = [
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 0 )
        },
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 1 )
        },
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 2 )
        },
        dataTimeString => {
            return this.getTimeUser ( dataTimeString, 3 )
        },
    ]

    private min = ['分','分','m','分']
    private hours = ['小时','時間','h','小時']
    private mouth = ['月','月','','月']
    private month_eng = ['Jan','Feb','Mar','Apr','May','June','Jul','Aug','Sep','Oct','Nov','Dec']

    public moreResultsButtomLoading = ko.observable ( false )
    public nextButtonLoadingGetResponse = ko.observable ( false )
    public nextButtonConetResponse = ko.observable ( false )
    public nextButtonShowError = ko.observable ( false )
    public nextButtonErrorIndex = ko.observable ( -1 )
    public blockBannerImg = blockBannerImg
    public videoHref = ko.observable ({})

    private getmonth ( mon, leng ) {
        if ( leng === 2 ) {
            return this.month_eng [ mon ]
        }
        return `${ mon + 1 }${ this.mouth [ leng ]}`
    }

    private retweeted_statusInit ( tweet ) {
        if ( tweet.retweeted_status && typeof tweet.retweeted_status !== "undefined" ) {
            tweet.retweeted_status['retweeted_statusUserName'] = tweet.user.name 
        } else {
            tweet.retweeted_status = false
            tweet['retweeted_statusUserName'] = false
        }
        if ( tweet.extended_entities ) {
            const kk = tweet.extended_entities.media[0]
            if ( kk && ! kk.video_info ) {
                kk['video_info'] = false 
            }

        }
    }

    private getFilesFromFileArray ( fileArray: any []) {
        const self = this
        let buffer = null
        const getdata = ( filenameObj ) => {
            const filename = filenameObj.fileName
            return _view.connectInformationMessage.fetchFiles ( filename, ( err, data ) => {
                if ( err ) {
                    console.log (`getFilesFromFileArray error, try again`, err )
                    return getdata ( filename )
                }

                return _view.sharedMainWorker.decryptStreamWithAPKey ( data.data, ( err, _buffer: Buffer ) => {
                    if ( err ) {
                        console.log ( `getFilesFromFileArray _view.sharedMainWorker.decryptStreamWithAPKey error stop `, err )
                        return
                    }
                    console.time ( ` Buffer.from ( _buffer ).toString('base64')`)
                    buffer += Buffer.from ( _buffer ).toString('base64')
                    console.timeEnd (` Buffer.from ( _buffer ).toString('base64')`)
                    if ( fileArray.length ) {
                        return getdata ( fileArray.shift () )
                    }
                    return _view.sharedMainWorker.unzipHTML ( self.uuid, buffer, ( err, data ) => {
                        if ( err ) {
                            return console.log ( `getFilesFromFileArray _view.sharedMainWorker.unzipHTML error`, err )
                        }
                        const datas: { data: string, filename: string } [] = data.folder
                        const videoObj = self.videoHref()
                        datas.forEach ( n => {
                            if ( ! videoObj [ n.filename ] ) {
                                const vv = new Blob ( [Buffer.from( n.data, 'base64')], { type: 'video/mp4'})
                                videoObj [ n.filename ] = URL.createObjectURL ( vv )
                            }
                        })
                        return self.videoHref( videoObj )
                    })
                })

            })
        }

        return getdata ( fileArray.shift ())

    }

    constructor ( public twitterObj: any [], public twitterHref, public uuid, private fileArray: any [], public showAccount: boolean, public _close: () => void = null ) {
        twitterObj.forEach ( n => this.retweeted_statusInit( n ))
        this.twitterTimeArray = ko.observableArray ( this.twitterObj )
        if ( fileArray ) {
            this.getFilesFromFileArray ( fileArray )
        }
    }

    public getTimeUser (  timeString, lang ) {
        const now = new Date()
        const create = new Date ( timeString )
        const range = now.getTime() - create.getTime ()
        if ( range < OneDay ) {
            return this.getTime ( timeString, lang ).replace ('·','')
        }
        if (  lang === 2 ) {
            return `${ this.getTime ( timeString, lang ).replace ('·','') } ${ create.getFullYear() }`
        }

        return `${ create.getFullYear() }年${ this.getTime ( timeString, lang ).replace ('·','') }日`
        
    }

    public getTime ( timeString, lang ) {
        const now = new Date()
        const create = new Date ( timeString )
        const range = now.getTime() - create.getTime ()
        /**
         *      less than one day
         */
        if ( range < OneDay ) {
            /**
             *      less than one hour
             */
            if ( range < OneHour ) {
                const mins = Math.round ( range / OneMin )
                return `· ${ mins }${ this.min [ lang ]}`
            }
            const hour = Math.round ( range / OneHour )
            return `· ${ hour }${ this.hours [ lang ]}`
        }
        const month = create.getMonth()
        const day = create.getDate()
        return `· ${ this.getmonth( month, lang ) }${ lang === 2 ? ' ': ''}${ day }`
    }

    public textareaHeight ( index, Quoted = false ) {
        const twitterObj: any = this.twitterTimeArray()[ index ]
        const id = twitterObj.id
        const d = document.getElementById( id )
        const lines = twitterObj.full_text.split ('\n')
        /*
        if ( lines < 2 ) {
            const totalText = twitterObj.full_text.length
            if ( totalText > 119 ) {
                return '3rem'
            }
            if ( totalText > 119 ) {
                return '3rem'
            }
        }
        */
		//const high = limit + lines.length * eachLine 
        //return high + 'rem'
        const high = d.scrollTop + d.scrollHeight + ( Quoted ? 16: 0 )
        
		return high + 'px'
    }

    public userTextareaHeight ( id ) {
        
       
        const d = document.getElementById( id )
       
        /*
        if ( lines < 2 ) {
            const totalText = twitterObj.full_text.length
            if ( totalText > 119 ) {
                return '3rem'
            }
            if ( totalText > 119 ) {
                return '3rem'
            }
        }
        */
		//const high = limit + lines.length * eachLine 
        //return high + 'rem'
        const high = d.scrollTop + d.scrollHeight
		return high + 'px'
    }

    public userCountFormat ( cc: number ) {
        const hh = cc.toString()
        return hh.replace(/\B(?=(\d{3})+(?!\d))/g,',')
    }

    public searchNext () {
        const self = this
        if ( this.moreResultsButtomLoading ()) {
            return
        }
        if ( this.nextButtonShowError ()) {
            return this.nextButtonShowError ( false )
        }
        const lastPost = this.twitterTimeArray().length - 1
        const post: twitter_post = this.twitterTimeArray()[ lastPost ]
        const user = post.user

        this.moreResultsButtomLoading ( true )

        const com: QTGateAPIRequestCommand = {
			command: 'CoSearch',
			Args: [ user.id_str, post.id ],
			error: null,
			subCom: 'twitter_user',
			requestSerial: uuid_generate(),
        }
        
        const showError = ( err ) => {
            this.moreResultsButtomLoading ( false )
            this.nextButtonLoadingGetResponse ( false )
            this.nextButtonConetResponse ( false )
            this.nextButtonErrorIndex ( _view.connectInformationMessage.getErrorIndex ( err ))
            this.nextButtonShowError ( true )
        }

        return _view.connectInformationMessage.emitRequest ( com, ( err, com: QTGateAPIRequestCommand ) => {

            if ( err ) {
                return showError ( err )
            }

            if ( !com ) {
                return self.nextButtonLoadingGetResponse ( true )
            }

            if ( com.error === -1 ) {
                self.nextButtonLoadingGetResponse ( false )
                return self.nextButtonConetResponse ( true )
            }

            if ( com.error ) {
                return showError ( com.error )
            }

            this.moreResultsButtomLoading ( false )
            this.nextButtonLoadingGetResponse ( false )
            this.nextButtonConetResponse ( false )

            const twObj: any[] = com.Args [0]
            const twitterHref = com.Args[1]
            const fileArray = com.Args[2]
            
            for ( let i of Object.keys( twitterHref )) {
                if ( !self.twitterHref[ i ] ) {
                    self.twitterHref[ i ] = twitterHref[ i ]
                }
                
            }
            twObj.forEach ( n => {
                self.retweeted_statusInit (n)
                self.twitterTimeArray.push ( n )
            })
            if ( fileArray ) {
                this.getFilesFromFileArray ( fileArray )
            }


        })
    }

    public close () {
        if ( this._close ) {
            return this._close ()
        }

    }
}