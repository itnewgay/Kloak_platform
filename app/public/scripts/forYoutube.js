class forYoutube extends sharedAppClass {
    constructor(exit) {
        super(exit);
        this.exit = exit;
        this.searchInputTextPlaceholderText = [
            ''
        ];
        this.search_form_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'youtube_search',
            requestSerial: null
        };
        this.search_form_item_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'getSnapshop',
            requestSerial: null
        };
        this.search_form_next_request = {
            command: 'CoSearch',
            Args: [],
            error: null,
            subCom: 'youtube_search_next',
            requestSerial: null
        };
    }
    search_form_response(com) {
    }
    converterWatchObj(multimediaObj) {
        multimediaObj['view_count'] = multimediaObj['total_views'];
        multimediaObj['duration'] = multimediaObj['videoDetails'].lengthSeconds;
        multimediaObj['title'] = multimediaObj.videoDetails.title;
        multimediaObj['upload_date'] = multimediaObj.microformat.playerMicroformatRenderer.uploadDate;
        multimediaObj['averageRating'] = multimediaObj['videoDetails'].averageRating;
        multimediaObj['description'] = multimediaObj.microformat.playerMicroformatRenderer.description ? multimediaObj.microformat.playerMicroformatRenderer.description.simpleText : '';
        multimediaObj['like_count'] = null;
        multimediaObj['id'] = uuid_generate();
        return multimediaObj;
    }
    getItemResponse(url, multimediaObjArray, exit) {
        const multimediaObj = multimediaObjArray[0].Args;
        if (!multimediaObj['title']) {
            this.converterWatchObj(multimediaObj);
        }
        let view = new showWebPageClass(url, null, multimediaObj, () => {
            exit();
            view = null;
            if (_view.mediaViewer) {
                _view.mediaViewer.terminate();
            }
        }, item => {
            // const uu = item
            console.log(item);
            if (item['streamingData']) {
                console.time("STARTING VIDEO PLAY REQUEST");
                _view.mediaViewer = new MediaViewer('video', item['title'], { player: document.getElementById('videoPlayer') }, (err, canplay) => {
                    view.videoCanStart(canplay);
                }, () => {
                });
                _view.mediaViewer.youtube(item);
            }
            else {
                view.videoUnablePlay(true);
                view.multimediaLoading(false);
            }
        });
    }
    _exit() {
        return this.exit();
    }
}
