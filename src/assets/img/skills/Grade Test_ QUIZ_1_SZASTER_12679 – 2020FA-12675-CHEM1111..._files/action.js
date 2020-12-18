  // action.js contains functions to be used in ActionBar widget

  // We need to be able to open in new window some documents when selecting actions from the menu
  // Example - link to MSN eLearn website for LRN Toolkit download
  var lrn = null;
  function newWindow(url,wname,param){
    if (lrn && !lrn.closed){lrn.focus();
  }else{
    lrn=window.open(url,wname,param);
  }
  }

  // Handle not only direct links but javascript also
  function jumpMenu(){
    if ((/^javascript/i).test(document.actionbar.filter.options[document.actionbar.filter.selectedIndex].value)){
      eval(document.actionbar.filter.options[document.actionbar.filter.selectedIndex].value);
    }else{
      window.location = document.actionbar.filter.options[document.actionbar.filter.selectedIndex].value;
    }
  }

  function openPopup( url )
  {
    var popup = window.open( url, 'bb_popup', 'width=800,height=500,resizable=yes,scrollbars=yes,status=yes,top=20,left=' + (screen.width - 800) );
    if( popup )
    {
      popup.focus();
    }
    return false;
  }
