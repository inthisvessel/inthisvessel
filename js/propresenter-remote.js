// ───── ProPresenter Remote — interactive prototype simulator ─────
(function () {
    // STATE
    var state = {
      idx: 1,
      sheetOpen: false,
      draft: '',
      stageMsg: null,
      scale: 'default',
      vo: false,
      toast: null,
      toastTimer: null
    };

    // DATA
    var slides = [
      { label: 'Blank', kind: 'media', text: '' },
      { label: 'Verse 1', kind: 'lyric', text: 'PEOPLE COME TOGETHER' },
      { label: 'Verse 2', kind: 'lyric', text: 'STRANGE AS NEIGHBORS\nOUR BLOOD IS ONE' },
      { label: 'Chorus', kind: 'lyric', text: 'WE WILL FIGHT FOR ONE ANOTHER' },
      { label: 'Chorus', kind: 'lyric', text: 'WE LIFT UP OUR PRAISE' },
      { label: 'Outro', kind: 'lyric', text: 'GOOD GRACE' }
    ];

    // ELEMENTS
    var simLiveMediaBg = document.getElementById('simLiveMediaBg');
    var simLiveLyrics = document.getElementById('simLiveLyrics');
    var simLiveLyricsText = document.getElementById('simLiveLyricsText');
    var simLivePosLabel = document.getElementById('simLivePosLabel');
    var simLiveSlideLabel = document.getElementById('simLiveSlideLabel');
    
    var btnPrev = document.getElementById('btnPrev');
    var btnNext = document.getElementById('btnNext');
    var simNextVoMsg = document.getElementById('simNextVoMsg');
    
    var btnOpenStageSheet = document.getElementById('btnOpenStageSheet');
    var simSheet = document.getElementById('simSheet');
    var simSheetBackdrop = document.getElementById('simSheetBackdrop');
    var btnCancelSheet = document.getElementById('btnCancelSheet');
    var btnSendToStage = document.getElementById('btnSendToStage');
    var simTextArea = document.getElementById('simTextArea');
    var simBottomMsgDot = document.getElementById('simBottomMsgDot');
    var simStageMsgBar = document.getElementById('simStageMsgBar');
    var simStageMsgText = document.getElementById('simStageMsgText');
    var btnClearStageMsg = document.getElementById('btnClearStageMsg');
    
    var simToast = document.getElementById('simToast');

    var thumbs = document.querySelectorAll('.thumb-btn');

    // RENDER FUNCTIONS
    function render() {
      var cur = slides[state.idx];
      var total = slides.length;

      // 1. Render Preview Area
      if (cur.kind === 'media') {
        simLiveMediaBg.style.display = 'block';
        simLiveLyrics.style.display = 'none';
      } else {
        simLiveMediaBg.style.display = 'none';
        simLiveLyrics.style.display = 'flex';
        
        // Render lyric lines
        simLiveLyricsText.innerHTML = '';
        var lines = cur.text.split('\n');
        lines.forEach(function (line) {
          var span = document.createElement('span');
          span.style.cssText = 'font-size:17px; font-weight:600; letter-spacing:0.04em; color:#fff; text-align:center; line-height:1.25;';
          span.textContent = line;
          simLiveLyricsText.appendChild(span);
        });
      }

      simLivePosLabel.textContent = 'Slide ' + (state.idx + 1) + ' of ' + total;
      simLiveSlideLabel.textContent = cur.label;

      // 2. Next Up Label
      if (state.idx < total - 1) {
        txtNextUpTitle.textContent = slides[state.idx + 1].label;
        simNextVoMsg.querySelector('.body').textContent = '“Next slide, button. Advances to slide ' + (state.idx + 2) + ' of ' + total + '.”';
      } else {
        txtNextUpTitle.textContent = 'End of Playlist';
        simNextVoMsg.querySelector('.body').textContent = '“Next slide, button. This is the last slide.”';
      }

      // 3. Update Thumbnails Active Rings
      thumbs.forEach(function (thumb, idx) {
        var tFrame = thumb.querySelector('.t-frame');
        var liveBadge = thumb.querySelector('.live-badge');
        
        if (idx === state.idx) {
          tFrame.style.border = '2px solid #EA6A2E';
          liveBadge.style.display = 'block';
          thumb.setAttribute('aria-label', 'Slide ' + (idx + 1) + ', ' + slides[idx].label + ', currently live');
        } else {
          tFrame.style.border = '1px solid rgba(255,255,255,0.10)';
          liveBadge.style.display = 'none';
          thumb.setAttribute('aria-label', 'Slide ' + (idx + 1) + ', ' + slides[idx].label);
        }
      });

      // 4. On stage message state
      if (state.stageMsg) {
        simStageMsgBar.style.display = 'flex';
        simStageMsgText.textContent = state.stageMsg;
        simBottomMsgDot.style.display = 'block';
      } else {
        simStageMsgBar.style.display = 'none';
        simBottomMsgDot.style.display = 'none';
      }

      // 5. Toast
      if (state.toast) {
        simToast.querySelector('span').textContent = state.toast;
      }
      simToast.classList.toggle('show', !!state.toast);
    }

    // ACTIONS
    function selectSlide(idx) {
      if (idx >= 0 && idx < slides.length) {
        state.idx = idx;
        render();
      }
    }

    function triggerToast(msg) {
      if (state.toastTimer) {
        clearTimeout(state.toastTimer);
      }
      state.toast = msg;
      render();
      state.toastTimer = setTimeout(function () {
        state.toast = null;
        render();
      }, 2600);
    }

    // EVENT BINDINGS
    btnPrev.addEventListener('click', function () {
      if (state.idx > 0) {
        selectSlide(state.idx - 1);
      }
    });

    btnNext.addEventListener('click', function () {
      if (state.idx < slides.length - 1) {
        selectSlide(state.idx + 1);
      }
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var idx = parseInt(thumb.getAttribute('data-idx'));
        selectSlide(idx);
      });
    });

    // Stage Message Sheet
    btnOpenStageSheet.addEventListener('click', function () {
      simSheet.style.display = 'flex';
      simTextArea.value = state.draft;
      simTextArea.focus();
    });

    function closeSheet() {
      simSheet.style.display = 'none';
      state.draft = '';
    }

    btnCancelSheet.addEventListener('click', closeSheet);
    simSheetBackdrop.addEventListener('click', closeSheet);

    simTextArea.addEventListener('input', function (e) {
      state.draft = e.target.value;
      if (state.draft.trim().length > 0) {
        btnSendToStage.style.background = '#EA6A2E';
        btnSendToStage.style.color = '#0A0A0B';
      } else {
        btnSendToStage.style.background = '#2C2C2E';
        btnSendToStage.style.color = '#6E6E73';
      }
    });

    // Presets
    var presets = document.querySelectorAll('.preset-btn');
    presets.forEach(function (preset) {
      preset.addEventListener('click', function () {
        var text = preset.getAttribute('data-text');
        simTextArea.value = text;
        state.draft = text;
        btnSendToStage.style.background = '#EA6A2E';
        btnSendToStage.style.color = '#0A0A0B';
        simTextArea.focus();
      });
    });

    btnSendToStage.addEventListener('click', function () {
      var msg = simTextArea.value.trim();
      if (msg) {
        state.stageMsg = msg;
        closeSheet();
        triggerToast('Message sent to stage');
      }
    });

    btnClearStageMsg.addEventListener('click', function () {
      state.stageMsg = null;
      render();
    });

    // Gesture list interactive hooks
    var gestItems = document.querySelectorAll('.gesture-item');
    gestItems.forEach(function (item) {
      item.addEventListener('click', function () {
        gestItems.forEach(function (i) { i.classList.remove('active'); });
        item.classList.add('active');

        var id = item.id;
        var idx = item.getAttribute('data-idx');
        if (idx !== null) {
          selectSlide(parseInt(idx));
        } else if (id === 'gestNext') {
          if (state.idx < slides.length - 1) selectSlide(state.idx + 1);
        } else if (id === 'gestPrev') {
          if (state.idx > 0) selectSlide(state.idx - 1);
        } else if (id === 'gestMsg') {
          // Toggle stage message
          if (state.stageMsg) {
            state.stageMsg = null;
            render();
          } else {
            // Trigger quick message presets automatically
            state.stageMsg = 'Please wrap up';
            triggerToast('Message sent to stage');
          }
        }
      });
    });

    // Initial render
    render();
  })();