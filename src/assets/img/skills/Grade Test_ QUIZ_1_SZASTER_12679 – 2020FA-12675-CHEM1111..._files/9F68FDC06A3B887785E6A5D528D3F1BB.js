/**
 * The items in GradebookCache are stored in HTML5 sessionStorage. 
 * The cache can avoid retrieving data from server repeatedly for GradeCenter page refresh and sub pages access.
 */
var GradebookCache = {
  KEY_COURSE_ID : 'gradebook.cache.course.id',
  KEY_JSON_FULL : 'gradebook.cache.json.full',
  KEY_JSON_DELTA : 'gradebook.cache.json.delta',
  KEY_LAST_JSON_UPDATE_TIME : 'gradebook.cache.last.json.update.time',
  KEY_LAST_USER_CHANGE_TIME : 'gradebook.cache.last.user.change.time',
  KEY_SCORE_PROVIDER_HASH : 'gradebook.cache.score.provider.hash',
  KEY_USERS_HASH : 'gradebook.cache.users.hash',
  KEY_VERSION : 'gradebook.cache.version',
  KEY_CURRENT_VIEW : 'gradebook.cache.current.view',
  KEY_ACCESSIBLE_MODE : 'gradebook.cache.assessible.mode',
  KEY_GRID_IMAGES : 'gradebook.cache.grid.images',
  KEY_COL_ORDER_MAP : 'gradebook.cache.col.order.map',
  // users IDs for the visible rows in the grid, also sorted
  KEY_VISIBLE_USER_IDS : 'gradebook.cache.visible.user.ids',
  // all the user ids, sorted
  KEY_SORTED_USER_IDS : 'gradebook.cache.sorted.user.ids',
  KEY_FILTER_CATEGORY : 'gradebook.cache.filter.category',
  KEY_FILTER_STATUS : 'gradebook.cache.filter.status',
  KEY_SORT_DIR : 'gradebook.cache.sort.dir',
  KEY_SORT_COLUMN_ID : 'gradebook.cache.sort.column.id',
  KEY_MESSAGES : 'gradebook.cache.messages',
  KEY_SORT_COLUMN_BY_ASCENDING : 'gradebook.cache.sort.column.by.ascending',
  KEY_SORT_COLUMN_BY : 'gradebook.cache.sort.column.by',
  /**
   * Gradebook.GridModel.store which is an attribute of Gradebook.GridModel stores the stuff required for page
   * refresh. For example, GradebookScrollContext is stored in Gradebook.GridModel.store. Then, for next page refresh,
   * the HScrollPos and VScrollPos can survive.
   */
  KEY_STORE : 'gradebook.cache.store',
  KEY_MINIMUM_ROW_NUM : 'gradebook.cache.mininum.row.num',
  KEY_ISOLATED_STUDENT_ID : 'gradebook.cache.isolated.student.id',

  setString : function( key, value )
  {
    if ( value !== undefined && value !== null )
    {
      ClientCache.setItem( key, value );
    }
    else
    {
      ClientCache.removeItem( key );
    }
  },
  
  getString : function( key )
  {
    return ClientCache.getItem( key );
  },
  
  setObject: function( key, value )
  {
    if ( value !== undefined && value !== null )
    {
      if (typeof (JSON) === 'object' && typeof (JSON.stringify) === 'function')
      {
        ClientCache.setItem( key, JSON.stringify( value ) );
      }
    }
    else
    {
      ClientCache.removeItem( key );
    }
  },

  getObject: function( key )
  {
    if (typeof (JSON) === 'object' && typeof (JSON.parse) === 'function')
    {
      return JSON.parse( ClientCache.getItem( key ) );
    }
    else
    {
      return eval('(' + ClientCache.getItem( key ) + ')');
    }
  },
  
  removeItem : function( key )
  {
    ClientCache.removeItem( key );
  },
  
  clear: function()
  {
    ClientCache.removeItem( this.KEY_COURSE_ID );
    ClientCache.removeItem( this.KEY_JSON_FULL );
    ClientCache.removeItem( this.KEY_JSON_DELTA );
    ClientCache.removeItem( this.KEY_LAST_JSON_UPDATE_TIME );
    ClientCache.removeItem( this.KEY_LAST_USER_CHANGE_TIME );
    ClientCache.removeItem( this.KEY_SCORE_PROVIDER_HASH );
    ClientCache.removeItem( this.KEY_USERS_HASH );
    ClientCache.removeItem( this.KEY_VERSION );
    ClientCache.removeItem( this.KEY_CURRENT_VIEW );
    ClientCache.removeItem( this.KEY_ACCESSIBLE_MODE );
    ClientCache.removeItem( this.KEY_GRID_IMAGES );
    ClientCache.removeItem( this.KEY_COL_ORDER_MAP );
    ClientCache.removeItem( this.KEY_VISIBLE_USER_IDS );
    ClientCache.removeItem( this.KEY_SORTED_USER_IDS );
    ClientCache.removeItem( this.KEY_FILTER_CATEGORY );
    ClientCache.removeItem( this.KEY_FILTER_STATUS );
    ClientCache.removeItem( this.KEY_SORT_DIR );
    ClientCache.removeItem( this.KEY_SORT_COLUMN_ID );
    ClientCache.removeItem( this.KEY_MESSAGES );
    ClientCache.removeItem( this.KEY_SORT_COLUMN_BY_ASCENDING );
    ClientCache.removeItem( this.KEY_SORT_COLUMN_BY );
    ClientCache.removeItem( this.KEY_STORE );
    ClientCache.removeItem( this.KEY_MINIMUM_ROW_NUM );
    ClientCache.removeItem( this.KEY_ISOLATED_STUDENT_ID );
  }
};

var gradebook_utils = {};

//called by grade detail page
gradebook_utils.getNextUserId = function(visibleUserIds, userId)
{
  for ( var i = 0; i < visibleUserIds.length - 1; i++)
  {
    if (visibleUserIds[i] == userId)
    {
      return visibleUserIds[i + 1];
    }
  }
  return null;
},

// called by grade detail page
gradebook_utils.getPrevUserId = function(visibleUserIds, userId)
{
  for ( var i = 1; i < visibleUserIds.length; i++)
  {
    if (visibleUserIds[i] == userId)
    {
      return visibleUserIds[i - 1];
    }
  }
  return null;
},

gradebook_utils.initPreviewDivs = function( previewDivClass, inlineExpansion )
{
  // loop through preview divs
  $A(document.getElementsByTagName('div')).each( function( div )
  {
    if ( page.util.hasClassName( div, previewDivClass ) )
    {
        div = $(div);
        if ( div.empty() || div.scrollWidth <= div.clientWidth && div.scrollHeight <= div.clientHeight )
        {
          // if div is empty or no overflow remove style so it's width & height shrink to fit the div contents
          div.removeClassName( previewDivClass );
        }
        else
        {
          // open lightbox with div contents when view full link is clicked
          var viewFullLink = div.next('a');
            if ( viewFullLink )
            {
              viewFullLink.removeClassName( 'hideoff' );
              if (inlineExpansion)
              {
                Event.observe( viewFullLink, 'click', function( event )
                 {
                  if (div.alreadyExpanded)
                  {
                    div.style.height = '';
                    div.style.width = '';
                    div.alreadyExpanded = false;
                  }
                  else
                  {
                    div.style.height = 'auto';
                    div.style.width = 'auto';
                    div.alreadyExpanded = true;
                  }
                   Event.stop( event );
                 });
              }
              else
              {
                Event.observe( viewFullLink, 'click', function( event )
                {
                  new lightbox.Lightbox({
                    defaultDimensions : { w :500, h :375 },
                    useDefaultDimensionsAsMinimumSize :true,
                    verticalBorder :125,
                    horizontalBorder :125,
                    title : div.readAttribute('bb:lbTitle'),
                    contents : '<div class="container">' + div.innerHTML + '</div>'
                  }).open();
                  Event.stop( event );
                });
              }
            }
        }
    }
  });
};

gradebook_utils.getNumberLocalizer = function()
{
  if( !gradebook_utils.numberLocalizer )
  {
    gradebook_utils.numberLocalizer = new NumberLocalizer();
  }
  return gradebook_utils.numberLocalizer;
};


/**
 * The constants below must be kept in sync with the corresponding fields in the server's Java code, in class GradebookSettingTORest
 * They also should be kept in sync with the DB schema, where columns used to store numeric scores are defined as 'numeric(15,5)'
 */
gradebook_utils.GradebookSettings =
{
  // LOWER_LIMIT_FOR_INVALID_VALUE is the smallest numeric value that the gradebook in Classic Learn considers as invalid when entering a grade
  LOWER_LIMIT_FOR_INVALID_VALUE : 10000000000, // => this corresponds to GradebookSettingTORest.beforeDecimal = 10
  // MAX_DECIMAL_DIGITS_SCORE is the maximum number of decimal digits that the gradebook in Classic Learn accepts when entering a grade
  MAX_DECIMAL_DIGITS_SCORE : 5, // => this corresponds to GradebookSettingTORest.afterDecimal = 5, which corresponds to GradeFormat.MAX_SCORE_DISPLAY_SCALE
  MAX_DECIMAL_DIGITS_POINTS : 5 // Corresponds to GradeFormat.MAX_POINT_DISPLAY_SCALE
};

/**
 * Takes a number that is unlocalized and converts it to the current locale format with minimum NumberLocalizer.DEFAULT_SCORE_MIN_FRACTION_DIGITS decimal places.
 * If the number can't be parsed into a number, then the number will be returned without formatting.
 *
 * @deprecated Use the truncation version instead.
 */
gradebook_utils.formatNumberMin2Digits = function( num, maxPrecision )
{
  var numLocalizer = gradebook_utils.getNumberLocalizer();

  return numLocalizer.formatScore( num, false /* round */ );
};

// Takes a number that is unlocalized and converts it to the current locale format with minimum NumberLocalizer.DEFAULT_SCORE_MIN_FRACTION_DIGITS decimal places.
// If the number can't be parsed into a number, then the number will be returned without formatting.
gradebook_utils.formatScoreTruncate = function ( num )
{
  var numLocalizer = gradebook_utils.getNumberLocalizer();

  return numLocalizer.formatScore( num, true /* truncate */ );
};

// Takes a number that is in the current locale format and converts it back to an unlocalized number.
gradebook_utils.parseNumber = function( num )
{
  var numLocalizer = gradebook_utils.getNumberLocalizer();
  return ( typeof num === "string" ) ? numLocalizer.parseNumber( num ) : num; //only parse if num is already localized (i.e. in string format)
};

gradebook_utils.validateGradeEntry = function( options )
{
  options = Object.extend(
  {
      inputField : null,
      label : null,
      confirmClearMsg : null,
      gradingSchema : null // TODO: Not supported yet, but when it is, pass in an object from gradebookgridmodel_schema.js
  }, options );

  if ( !options.inputField )
  {
    // If we don't have an input field then it can't be valid
    return false;
  }

  options.inputField.value = gradebook_utils.trimString( options.inputField.value );

  if ( options.confirmClearMsg )
  {
    // Only check for clearing the grade if we have a clear msg
    if ( options.inputField.value === '-' ||
         ( options.inputField.value === '' && !options.inputField.defaultValue.blank() ) )
    {
      if ( !confirm( options.confirmClearMsg ) )
      {
        // The user doesn't want to clear the grade - revert the field back to the defaultValue
        options.inputField.value = options.inputField.defaultValue;
        return false;
      }
      // They've confirmed the clearing of the attempt -force the field to '-' as that is what the server expects
      // to clearly indicate 'clear' grade.
      options.inputField.value = '-';
      return true;
    }
  }

  var validationPassed = false;
  if ( options.label )
  {
    // Only check the numeric value if we're given a label to display
    var gradeInput = new inputText(
    {
        ref_label : options.label,
        id : options.inputField.id,
        trim : true,
        valid_efloat : true,
        minlength : 1,
        maxlength : 11
    } );

    validationPassed = gradeInput.check();
  }

  if (!validationPassed && options.gradingSchema)
  {
    validationPassed = options.gradingSchema(options.inputField.value, true);
  }

  return validationPassed;
};

gradebook_utils.trimString = function( strintToTrim )
{
  if( typeof String.prototype.trim === 'function' )
  {
    return strintToTrim.trim();
  }
  else
  { // we need this until we stop supporting IE8
    return strintToTrim.replace(/^\s+|\s+$/gm,'');
  }
};

gradebook_utils.getPointsForRawValue = function( colDef, isCalculated, pointsPossible )
{
  // Used primarily in the gradebookgridmodel_schema for getRawValue.
  // Primary function when the column is calculated and the variable isCalculated is included
  // (which would only be a set variable if it came from gradebookgridmodel_customview.js)
  // we return the value of the pointsPossible rather than the default colDef.points
  if( isCalculated )
  {
    return ( pointsPossible ) ? pointsPossible : 100;
  }
  return ( colDef.points ) ? colDef.points : 100;
};
// Gradebook is grade center namespace
var Gradebook =
{
  getModel: function()
  {
    try
    {
      if ( window.gbModel )
      {
        // If our window already has the model, just use it:
        return window.gbModel;
      }
      else
      {
        // If we don't then we have to rebuild it - first check the cache, and if not found there, reload from the server.
        var loadFromCache = false;
        var courseId = GradebookCache.getString( GradebookCache.KEY_COURSE_ID );

        if ( window.courseID && courseId && courseId != window.courseID )
        {
          GradebookCache.clear();
          courseId = window.courseID;
        }

        courseId = GradebookCache.getString( GradebookCache.KEY_COURSE_ID );
        if ( courseId )
        {
          loadFromCache = true;
        }
        else
        {
          courseId = window.courseID;
        }
        var gradebookService = new Gradebook.GridService( courseId );
        if ( loadFromCache )
        {
          window.gbModel = new Gradebook.GridModel( gradebookService );
          var accessibleMode = window.accessibleModeParam ? window.accessibleModeParam : window.sessionAccessibleMode;
          var gridImages = GradebookCache.getObject( GradebookCache.KEY_GRID_IMAGES );

          window.gbModel.accessibleMode = (accessibleMode == 'true');
          window.gbModel.setUserCanViewGradebookAttempts( window.userCanViewGradebookAttempts == 'true' );
          window.gbModel.setUserCanViewGradebookGrades( window.userCanViewGradebookGrades == 'true' );
          window.gbModel.setUserCanEnterGradingFeedback( window.userCanEnterGradingFeedback == 'true' );
          window.gbModel.setUserCanEnterAttemptGrades( window.userCanEnterAttemptGrades == 'true' );
          window.gbModel.setUserCanOverrideGrades( window.userCanOverrideGrades == 'true' );
          window.gbModel.setUserHasFullGradebookAccess( window.userHasFullGradebookAccess == 'true' );
          window.gbModel.setUserCanPerformAllGradingActions( window.userCanPerformAllGradingActions == 'true' );
          window.gbModel.gridImages = gridImages;
          window.gbModel.setFloatLocaleFormat( GradebookUtil.getFloatLocaleFormatFromWindow() );

          window.gbModel.loadDataFromCache();
          window.gbModel.setCurrentView(GradebookCache.getString( GradebookCache.KEY_CURRENT_VIEW ));
          window.gbModel.categoryFilter = GradebookCache.getString(GradebookCache.KEY_FILTER_CATEGORY);
          window.gbModel.statusFilter =GradebookCache.getString(GradebookCache.KEY_FILTER_STATUS);
          window.gbModel.colOrderMap = GradebookCache.getObject( GradebookCache.KEY_COL_ORDER_MAP );
          window.gbModel.sortColumnId = GradebookCache.getString( GradebookCache.KEY_SORT_COLUMN_ID );
          window.gbModel.sortDir = GradebookCache.getString( GradebookCache.KEY_SORT_DIR );
          window.gbModel.sortColAscending = GradebookCache.getString( GradebookCache.KEY_SORT_COLUMN_BY_ASCENDING );
          window.gbModel.currentSortColumnBy = GradebookCache.getString( GradebookCache.KEY_SORT_COLUMN_BY);
          window.gbModel.store = GradebookCache.getObject(GradebookCache.KEY_STORE);
          window.gbModel.minimumRows = GradebookCache.getObject(GradebookCache.KEY_MINIMUM_ROW_NUM);
          window.gbModel.isolatedStudentId = GradebookCache.getObject(GradebookCache.KEY_ISOLATED_STUDENT_ID);
        }
        else
        {
          window.gbModel = new Gradebook.GridModel(gradebookService);
        }
        return window.gbModel;
      }
    }
    catch ( ignore )
    {
      return null;
    }
  },

  clearModel: function()
  {
    window.gbModel = null;
    GradebookCache.clear();
  }
};

var GradebookUtil =
{

  parseLocaleFloat : function( num )
  {
    // substitute for later calls to not have to Gradebook.getModel().getNumberFormatter()
    GradebookUtil.parseLocaleFloat = Gradebook.getModel().getNumberFormatter().parseLocaleFloat;
    return GradebookUtil.parseLocaleFloat( num );
  },

  toLocaleFloat : function( num )
  {
    GradebookUtil.toLocaleFloat = Gradebook.getModel().getNumberFormatter().getDisplayFloat;
    return GradebookUtil.toLocaleFloat( num );
  },

  toLocaleScoreTruncate : function( num )
  {
    GradebookUtil.toLocaleScoreTruncate = Gradebook.getModel().getNumberFormatter().formatScoreTruncate;
    return GradebookUtil.toLocaleScoreTruncate( num );
  },

  /*
   * Deprecated: Usually need to truncate instead.
   *
   * Rounds input number for a certain count of fraction digits.
   * @param num the number to round (required)
   * @param digits specifies how many fraction digits the 'num' should be rounded to (not required, default 2)
   * @return Returns rounded number to a certain count of fraction digits.
   */
  round: function( num, digits )
  {
    if ( typeof( digits ) === 'undefined' ) digits = 2;
    var base = Math.pow( 10, digits );

    return Math.round( num * base ) / base;
  },

  error : function( errorMsg )
  {
    // firebug/IE console
    if ( console && console.error )
    {
      console.error( errorMsg );
    }
  },

  log : function( logMsg )
  {
    // firebug/IE console
    if ( console && console.log )
    {
      console.log( logMsg );
    }
  },

  isIE: function ()
  {
    return navigator.userAgent.toLowerCase().indexOf("msie") >= 0;
  },

  isFFonMac: function()
  {
    return GradebookUtil.isMac() && GradebookUtil.isFirefox();
  },

  isFirefox: function()
  {
    return (navigator.userAgent.toLowerCase().indexOf("firefox") != -1);
  },

  isMac: function()
  {
    return (navigator.userAgent.toLowerCase().indexOf("mac") != -1);
  },

  getFloatLocaleFormatFromWindow: function()
  {
    var localeFloatFormat = { separator:'.', format:'' };
    if ( window.LOCALE_SETTINGS )
    {
      if ( LOCALE_SETTINGS.getString('number_format.decimal_point') )
      {
        localeFloatFormat.separator = LOCALE_SETTINGS.getString('number_format.decimal_point');
      }
      if ( LOCALE_SETTINGS.getString('float.allow.negative.format') )
      {
        localeFloatFormat.format = LOCALE_SETTINGS.getString( 'float.allow.negative.format' );
      }
    }
    else
    {
      var separator = page.bundle.getString('number_format.decimal_point');
      if ( separator )
      {
        localeFloatFormat.separator = separator;
      }
    }
    if ( !localeFloatFormat.format )
    {
      // for some reason the current locale does not define the format, so let's build one
      if ( localeFloatFormat.separator === ',' )
      {
        localeFloatFormat.format = '^[-]?[0-9]*(,[0-9]+)?$';
      }
      else
      {
        localeFloatFormat.format = '^[-]?[0-9]*(\\.[0-9]+)?$';
      }
    }
    return localeFloatFormat;
  },

  isValidFloat: function ( n )
  {
    if ( n instanceof Number || typeof( n ) == 'number' )
    {
      return true;
    }
    n = '' + n;
    var trimmedVal = n.strip();
    var floatLocaleFormat = null;
    var model = Gradebook.getModel();
    if ( model && model.getFloatLocaleFormat()  )
    {
      floatLocaleFormat = model.getFloatLocaleFormat();
    }
    else
    {
      // those settings would be the settings of the page where the javascript code
      // is executed, which might not be in the same locale as the course itself
      floatLocaleFormat = this.getFloatLocaleFormatFromWindow();
    }
    if (trimmedVal.endsWith( floatLocaleFormat.separator ))
    {
      trimmedVal += '0';
    }
    var re = new RegExp( floatLocaleFormat.format );
    var isValidNum = trimmedVal.search( re ) === 0;
    return isValidNum;
  },

  isGradeValueTooBig: function ( inputValue )
  {
    return inputValue >= gradebook_utils.GradebookSettings.LOWER_LIMIT_FOR_INVALID_VALUE;
  },

  formatStudentName: function ( student )
  {
    var nameData = {first:student.first, last:student.last, user:student.user};
    return GradebookUtil.getMessage('userNameTemplate', nameData);
  },

  trimId: function( primaryKey )
  {
    if ( primaryKey.charAt(0) != '_' )
    {
      return primaryKey;
    }
    return primaryKey.slice(1, primaryKey.lastIndexOf('_') );
  },

  getMessage: function (key, args) {
    if ( Gradebook.getModel() ) {
      return Gradebook.getModel().getMessage(key, args);
    } else {
      return key;
    }
  },

  getElementsComputedStyle: function ( htmlElement, cssProperty, mozillaEquivalentCSS)
  {
    if ( arguments.length == 2 )
    {
      mozillaEquivalentCSS = cssProperty;
    }

    var el = $(htmlElement);
    if ( el.currentStyle )
    {
      return el.currentStyle[cssProperty];
    }
    else
    {
      return document.defaultView.getComputedStyle(el, null).getPropertyValue(mozillaEquivalentCSS);
    }
  },

  toViewportPosition: function(element)
  {
    return this._toAbsolute(element,true);
  },

  /**
   *  Compute the elements position in terms of the window viewport
   *  so that it can be compared to the position of the mouse (dnd)
   *  This is additions of all the offsetTop,offsetLeft values up the
   *  offsetParent hierarchy, ...taking into account any scrollTop,
   *  scrollLeft values along the way...
   *
   *  Note: initially there was 2 implementations, one for IE, one for others.
   *  Mozilla one seems to fit all though (tested XP: FF2,IE7, OSX: FF2, SAFARI)
   **/
  _toAbsolute: function(element,accountForDocScroll, topParent )
  {
    return this._toAbsoluteMozilla(element,accountForDocScroll,topParent);
  },

  /**
   *  Mozilla did not report all of the parents up the hierarchy via the
   *  offsetParent property that IE did.  So for the calculation of the
   *  offsets we use the offsetParent property, but for the calculation of
   *  the scrollTop/scrollLeft adjustments we navigate up via the parentNode
   *  property instead so as to get the scroll offsets...
   *
   **/
  _toAbsoluteMozilla: function(element,accountForDocScroll, topParent)
  {
    // possibly should be replaced by prototype viewportOffset
    var x = 0;
    var y = 0;
    var parent = element;
    while ( parent && ( !topParent || parent!=topParent ) )
    {
      x += parent.offsetLeft;
      y += parent.offsetTop;
      parent = parent.offsetParent;
    }

    parent = element;
    while ( parent &&
        parent != document.body &&
        parent != document.documentElement &&
        ( !topParent || parent!=topParent ) )
    {
      if ( parent.scrollLeft  )
      {
        x -= parent.scrollLeft;
      }
      if ( parent.scrollTop )
      {
        y -= parent.scrollTop;
      }
      parent = parent.parentNode;
    }

    if ( accountForDocScroll )
    {
      x -= this.docScrollLeft();
      y -= this.docScrollTop();
    }

    return { x:x, y:y };
  },

  docScrollLeft: function() {
    if ( window.pageXOffset )
    {
      return window.pageXOffset;
    }
    else if ( document.documentElement && document.documentElement.scrollLeft )
    {
      return document.documentElement.scrollLeft;
    }
    else if ( document.body )
    {
      return document.body.scrollLeft;
    }
    else
    {
      return 0;
    }
  },

  docScrollTop: function()
  {
    if ( window.pageYOffset )
    {
      return window.pageYOffset;
    }
    else if ( document.documentElement && document.documentElement.scrollTop )
    {
      return document.documentElement.scrollTop;
    }
    else if ( document.body )
    {
      return document.body.scrollTop;
    }
    else
    {
      return 0;
    }
  },

  getChildElementByClassName: function(parent, childTag, childClassName)
  {
    var children = parent.getElementsByTagName(childTag);
    if (!children || children.length === 0)
    {
      return null;
    }
    for (var i = 0; i < children.length; i++)
    {
      if (children[i].className.indexOf(childClassName) >= 0)
      {
        return children[i];
      }
    }
    return null;
  },

  // returns true if the text area length is less than maxLength.
  // text area length is greater than maxLength, alerts user, sets focus to text area and returns false
  validateMaxLength : function( textArea, label, maxlength )
  {
    var textLength = textArea.value.length;
    if ( maxlength < textLength )
    {
      if ( (textLength - maxlength) > 1 )
      {
        alert(JS_RESOURCES.getFormattedString('validation.maximum_length.plural', [label, maxlength, textLength - maxlength] ));
      }
      else
      {
        alert(JS_RESOURCES.getFormattedString('validation.maximum_length.singular', [label, maxlength] ));
      }
      textArea.focus();
      return false;
    }
    else
    {
      return true;
    }
  },

  appendSeperator : function( items )
  {
    if (!items || items.length === 0 || items[items.length -1].type == "seperator")
    {
      return;
    }
    items.push( { type : "seperator" } );
  }


};


/**
  *  Gradebook data grid
  *
  *  PORTIONS OF THIS FILE ARE BASED ON RICO LIVEGRID 1.1.2
  *
  *  Copyright 2005 Sabre Airline Solutions
  *
  *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
  *  file except in compliance with the License. You may obtain a copy of the License at
  *
  *         http://www.apache.org/licenses/LICENSE-2.0
  *
  *  Unless required by applicable law or agreed to in writing, software distributed under the
  *  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
  *  either express or implied. See the License for the specific language governing permissions
  *  and limitations under the License.
  *
  * File:
  * Authors(s): Bill Richard
  * Description: Main controller class for gradebook2 grid.
  * Version:
  **/

var GradebookGridUtil =
{
  // WARNING: do not call the showInlineReceipt function until any previous requests have completed
  // because it will reload the page and may cause the previous request to terminate prematurely
  // Might also want to add a Show Inline Method that does not require a reload
  reloadAndShowInlineReceipt : function(message)
  {
    window.location.href = window.viewSpreadsheetURL + '&inline_receipt_message=' + message;
  },

  showAlertLightbox : function( flyoutFormId, title, firstElement )
  {
    var lightboxParam =
    {
      dimensions :
      {
        w : 600,
        h : 150
      },
      title : title,
      closeOnBodyClick : false,
      showCloseLink : false,
      contents :
      {
        id : flyoutFormId,
        move : true
      }
    };
    Gradebook.alertLightbox = new lightbox.Lightbox( lightboxParam );
    var submitButton = $( flyoutFormId + 'Submit');
    var myFirstElement = $( firstElement );
    Gradebook.alertLightbox.open(function()
    {
      myFirstElement.focus();
      Gradebook.alertLightbox.lastLink = submitButton;
      Gradebook.alertLightbox.firstLink = myFirstElement;
    });
    GradebookGridUtil.resizeLightbox( flyoutFormId );
  },

  resizeLightbox : function( content )
  {
    var newHeight = $( content ).getHeight( ) + 60;
    if ( newHeight > 150 )
    {
      Gradebook.alertLightbox.resize( {w:600, h:newHeight } );
    }
  },

  //on firefox/mac scroll bars will show ontop of anything if not shimmed
  shimDiv : function(menuDiv)
  {
    var shimIFrame = $('shimDiv');
    if (!shimIFrame)
    {
      return;
    }
    shimIFrame.style.width = menuDiv.offsetWidth;
    shimIFrame.style.height = menuDiv.offsetHeight;
    var position = Position.page(menuDiv);
    shimIFrame.style.top = position[1];
    shimIFrame.style.left = position[0];
    shimIFrame.style.zIndex = 2;
    shimIFrame.style.display = "block";
  },

  clearShim : function()
  {
    if ($("shimDiv"))
    {
      $("shimDiv").style.display = "none";
    }
  }
};

var GradebookScrollContext = Class.create(
{
  initialize: function( accessibleMode, currentView )
  {
    this.accessibleMode = accessibleMode;
    this.currentView = currentView;

    if ( this.accessibleMode )
    {
      this.accessibleScrollSettings = {};
    }
    else
    {
      this.inaccessibleScrollSettings = {};
    }
  },

  saveScrollCoordinates: function()
  {
    if ( this.accessibleMode )
    {
      this.saveScreenReaderModeScrollCoordinates();
    } else
    {
      this.saveInteractiveModeScrollCoordinates(theGradeCenter.grid.viewPort);
    }
  },

  saveScreenReaderModeScrollCoordinates: function()
  {
    var container = document.getElementById('table1_accessible_container');
    this.accessibleScrollSettings.y = container.scrollTop;
    this.accessibleScrollSettings.x = container.scrollLeft;
  },

  saveInteractiveModeScrollCoordinates: function(viewPort)
  {
    if ( !viewPort )
    {
      return;
    }
    if ( viewPort.scrollerDiv )
    {
      this.inaccessibleScrollSettings.scrollTop = viewPort.scrollerDiv.scrollTop;
    }
    if ( viewPort.scrollerDivH )
    {
      this.inaccessibleScrollSettings.scrollLeft = viewPort.scrollerDivH.scrollLeft;
    }
    this.inaccessibleScrollSettings.lastVScrollPos = viewPort.lastVScrollPos;
    this.inaccessibleScrollSettings.lastHScrollPos = viewPort.lastHScrollPos;
  }
});

GradebookScrollContext.Constants =
{
  GRADEBOOK_SCROLL_CONTEXT: 'GradebookScrollContext'
};


GradebookScrollContext.getNewInstance = function( model, accessibleMode )
{
    var gradebookScrollContext = new GradebookScrollContext( accessibleMode, model.currentView );
    model.setObject( GradebookScrollContext.Constants.GRADEBOOK_SCROLL_CONTEXT , gradebookScrollContext );
    return gradebookScrollContext;
};

GradebookScrollContext.getExistingInstance = function( model, accessibleMode )
{
  var scrollContext = model.getObject( GradebookScrollContext.Constants.GRADEBOOK_SCROLL_CONTEXT  );
  if (!scrollContext)
  {
    return null;
  }
  if (scrollContext.currentView != model.currentView)
  {
    return null;
  }
  if (scrollContext.accessibleMode != model.accessibleMode)
  {
    return null;
  }
  return scrollContext;
};

Gradebook.Grid = Class.create();

Gradebook.Grid.prototype =
{

  initialize : function(tableId, gradebookService, options, model)
  {

    this.options =
    {
      gradeHistoryEnabled: true,
      scrollerBorderRight : '1px solid #ababab',
      sortBlankImg : 'images/blank.gif',
      topArrowLImg : 'images/toparrowL.gif',
      topArrowRImg : 'images/toparrowR.gif',
      botArrowLImg : 'images/botarrowL.gif',
      botArrowRImg : 'images/botarrowR.gif',
      numFrozenColumns : 0,
      accessibleMode : false,
      userHasFullGradebookAccess : false
    };
    Object.extend(this.options, options ||
    {});

    this.tableId = tableId;
    this.table = $(tableId);

    this.currentSelectedCell = null;

    if (model)
    {
      this.model = model;
      this.model.removeModelListeners();
      this.model.gradebookService = gradebookService;
    }
    else
    {
      this.model = new Gradebook.GridModel(gradebookService);
    }
    this.model.addModelListener(this);
    // setting the scroll context stored in model to survive page refresh
    var scrollContext = this.model.getObject( "scrollContext" );
    if ( !scrollContext )
    {
       scrollContext = this.model.newObject( "scrollContext" );
       scrollContext.x = 0;
       scrollContext.y = 0;
    }
    this.scrollContext = scrollContext;

    this.initClearAttemptsFlyOut();
    if (this.model.getNumColDefs() === 0)
    {
      this.model.requestLoadData();
    }
    else
    {
      this.model.requestUpdateData();
    }
    this.wrapTable();
  },

  /**
   * Determines the html table row index of the specified course membership id.
   *
   * Returns an object with two properties: a boolean indicating whether the row was found
   * and if found, the row index of the specified course member.
   */
  getHtmlRowIndexByUserId: function(userId)
  {
    var visibleRows = this.model.visibleRows;
    var result = {found:false};
    var scrollableColRowIterators = this.model.getRowIterators();

    for (var i=0; i < visibleRows.length; i++)
    {
      if ( scrollableColRowIterators[i].dataArray[0].uid == userId )
      {
        result.index = i;
        result.found = true;
        break;
      }
    }
    return result;
  },

  wrapTable : function()
  {
    var table = this.table;
    // wrap table with a new container div: relative see IE7 bug:
    // http://rowanw.com/bugs/overflow_relative.htm
    table.insert(
    {
      before : "<div id='" + this.tableId + "_container' style='position:relative;'></div>"
    });
    table.previousSibling.appendChild(table);

    if (!this.options.accessibleMode)
    {
      // wrap table with a new viewport div
      table.insert(
      {
        before : "<div id='" + this.tableId + "_viewport'></div>"
      });
      table.previousSibling.appendChild(table);
    }
  },

  modelChanged : function()
  {
    $('loadStatusMsg').update(GradebookUtil.getMessage('creatingGridMsg'));
    this.model.removeModelListeners();
    setTimeout(this.createView.bind(this), 50);
  },

  modelError : function(exception, serverReply)
  {
    this.loaded = true;
    window.model = null;
    GradebookCache.clear();

    var localStorageExceededExceptionThrown = ClientCache.DOM_QUOTA_REACHED_EXCEPTION === ClientCache
        .getClientCacheException( exception );

    if (serverReply && !localStorageExceededExceptionThrown)
    {
      // server returned error page instead of json data
      if (exception.name && exception.message)
      {
        document.write(exception.name + ': ' + exception.message + '     ');
      }
      document.write(serverReply);
      document.close();
    }
    else
    {
      $( 'loadstatus' ).hide();
      if ( localStorageExceededExceptionThrown )
      {
        var errorMsgKey = 'loadingFailureStorageMaximumExceededMsg';
        if ( GradebookUtil.isMac() )
        {
          errorMsgKey = errorMsgKey + 'Mac';
        }
        else if ( GradebookUtil.isFirefox() )
        {
          errorMsgKey = errorMsgKey + 'Firefox';
        }
        $( 'loadingGridErrorMsg' ).update( GradebookUtil.getMessage( errorMsgKey ) );
      }
      else
      {
        $( 'loadingGridErrorMsg' ).update( GradebookUtil.getMessage( 'errorParsingDataMsg' ) );
      }
      $( 'errorLoadingGrid' ).show();
      if ( exception )
      {
        if ( exception.name && exception.message )
        {
          $( 'loadingGridError' ).update( exception.name + ': ' + exception.message );
        }
        else
        {
          $( 'loadingGridError' ).update( exception );
        }
      }
    }
  },

  initClearAttemptsFlyOut : function()
  {
    var clearAttempsFormPanel = $('clearAttemptsFlyOut');
    // direct root child to solve absolute positioning issues
    // clearAttempsFormPanel.remove();
    // document.getElementsByTagName('body')[0].appendChild(
    // clearAttempsFormPanel );
    Event.observe(clearAttempsFormPanel, 'click', function(event)
    {
      Gradebook.doNotCloseAttemptsForm = true;
    });
    Event.observe($('dp_bbDateTimePicker_start_date'), 'click', function(event)
    {
      $('clearAttemptsOptionRange').checked = true;
    });
    Event.observe($('dp_bbDateTimePicker_end_date'), 'click', function(event)
    {
      $('clearAttemptsOptionRange').checked = true;
    });
    Event.observe($('dp_bbDateTimePicker_start_date'), 'change', function(event)
    {
      $('clearAttemptsOptionRange').checked = true;
    });
    Event.observe($('dp_bbDateTimePicker_end_date'), 'change', function(event)
    {
      $('clearAttemptsOptionRange').checked = true;
    });
    Event.observe('selectOption', 'change', function(event)
    {
      $('clearAttemptsOptionSelect').checked = true;
    });
    Gradebook.clearAttemptsFormDefault =
    {};
    Gradebook.clearAttemptsFormDefault.defaultSelect = $('selectOption').value;
    Gradebook.clearAttemptsFormDefault.defaultStartDate = $('dp_bbDateTimePicker_start_date').value;
    Gradebook.clearAttemptsFormDefault.defaultEndDate = $('dp_bbDateTimePicker_end_date').value;
    Gradebook.clearAttemptsFormDefault.defaultStartDateHidden = $('bbDateTimePickerstart').value;
    Gradebook.clearAttemptsFormDefault.defaultEndDateHidden = $('bbDateTimePickerend').value;

    Event.observe('clearAttemptsFlyOutCancel', 'click', function(event)
    {
      $("clearAttemptsFlyOut").style.display = "none";
    });
  },

  createView : function()
  {
    this.options.numFrozenColumns = window.model.getNumFrozenColumns();
    this.modelSortIndex = this.model.getSortIndex();
    this.sortDir = this.model.getSortDir();
    this._sizeHTMLTable();

    // defer initialization that depends on the size of the HTML table.
    // IE10 returns height of 0 for the table at this point. Need to let
    // prior Javascript DOM changes to take effect before executing the rest.
    (function()
    {
      this._initializeHTML();
      this.viewPort = new Gradebook.GridViewPort(this.table, this.model, this.options, this);
      this.model.addModelListener(this.viewPort);
      this.viewPort.refreshContentsH();
      if (this.options.accessibleMode)
      {
        this.setAccessibleViewportSize(); // Set the size after refreshing contents
      }
      this.updateSortImage();
      this.restoreFocus();

      if ( this.options.onLoadComplete ){
        this.options.onLoadComplete();
      }

      this.loaded=true;
    }.bind(this).defer());
  },


  /**
   * Scrolls the viewport horizontally to display the specified grade item
   */
  scrollGradeItemIntoViewPort: function( gradableItemId )
  {
    var htmlColumnIndex = this.model.getVisibleColDefIndex( gradableItemId );
    if (htmlColumnIndex == -1)
    {
      return false;
    }
    var htmlColumn = theGradeCenter.grid.isHtmlColumnIndexVisible( htmlColumnIndex );
    if (!htmlColumn.found)
    {
      // grade column is not currently visible.  scroll horizontally to ensure it's in view
      theGradeCenter.grid.viewPort.scrollCols(htmlColumn.diff, true);
    }
    return true;
  },

  /**
   * Scrolls the viewport vertically to display the specified course member
   */
  scrollCourseMemberIntoViewPort: function( userId )
  {
    var htmlRow = theGradeCenter.grid.getHtmlRowIndexByUserId( userId );
    if (!htmlRow)
    {
      return false;
    }

    if (!htmlRow.found)
    {
      return false;
    }

    htmlRow = theGradeCenter.grid.isHtmlRowIndexVisible( htmlRow.index );
    if (!htmlRow.isVisible)
    {
      // student row is not currently visible.  scroll vertically to ensure it's in view
      theGradeCenter.grid.viewPort.scrollRows(htmlRow.diff, true);
    }
    return true;
  },

  /**
   * Returns whether the specified domElement is currently viewable in the grid
   */
  isGridCellInView: function( domElement )
  {
    var docViewTop =  document.viewport.getScrollOffsets().top;
    var docViewBottom = docViewTop + $(document).viewport.getHeight();
    var viewPortOffset = $(domElement).viewportOffset();
    var elemTop = viewPortOffset.top;
    var elemBottom = elemTop + $(domElement).getHeight();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) &&
            (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
  },

  /**
   * Returns whether the specified row is visible in the viewport
   */
  isHtmlRowIndexVisible: function(index)
  {
    var results = {isVisible:false};
    var numRows = this.viewPort.numVisibleRows;
    var lastRowPos = this.viewPort.lastRowPos;

    if ( index < lastRowPos || index > lastRowPos + numRows )
    {
      results.diff = index - lastRowPos ;
    }
    else
    {
      results.isVisible = true;
    }
    return results;
  },

  /**
   * Returns whether the specified column is visible in the viewport
   */
  isHtmlColumnIndexVisible: function(index)
  {
    var numFrozenColumns = this.viewPort.options.numFrozenColumns;
    var numVisibleColumns = this.viewPort.numVisibleCols;
    var colOffset = this.viewPort.colOffset;
    if ( numFrozenColumns >= numVisibleColumns )
    {
      return -1;
    }
    var results = {found:false};
    var items = this.model.getColDefs(false, false);
    var lastColIndex = numVisibleColumns + colOffset - 1;
    var lastViewableColumn = items[ lastColIndex ];

    for (var i = 0, idx = 1; i < items.length; i++)
    {
      if ( i == index )
      {
        results.index = i;
        if ( lastColIndex > results.index )
        {
          results.diff = results.index - lastColIndex;
        }
        else if (results.index > lastColIndex)
        {
          results.diff = results.index - lastColIndex;
        }
        else
        {
         results.found = true;
        }
        break;
      }
    }
    return results;
  },

  setAccessibleViewportSize : function()
  {
    // container div will scroll in accessible mode
    var contDiv = $(this.tableId + '_container');
    var oneRowHeight = 20;
    var h = 0;
    if (this.table.rows.length > 0)
    {
      for (var i=0;i<this.table.rows.length;i++)
      {
        h = h + this.table.rows[i].offsetHeight + 1; // +1 for border spacing
      }
    }
    else
    {
      var rows = this.model.visibleRows.length + 1;
      h = rows * oneRowHeight + 10;
    }
    h = Math.min(this.options.tableHeight, h);
    var w = this.options.tableWidth;
    contDiv.style.height = h + "px";
    contDiv.style.width = w + "px";
    contDiv.style.overflow = "auto";
  },

  _initializeHTML : function()
  {
    if (document.onClickHandler)
    {
      Event.stopObserving(document, 'click', document.onClickHandler);
    }
    document.onClickHandler = this.onDocumentClickHandler.bindAsEventListener(this);
    Event.observe(document, 'click', document.onClickHandler);

    if (this.options.accessibleMode)
    {
      this.setAccessibleViewportSize();
      return;
    }

    var viewportDiv = $(this.tableId + '_viewport');
    viewportDiv.style.height = (this.table.offsetHeight) + "px";
    viewportDiv.style.overflow = "hidden";

    var c, numHCols;

    // add controllers to table cells
    var tableHeader = $(this.table.id + '_header');
    if (tableHeader)
    {
      numHCols = tableHeader.rows[0].cells.length;
      for (c = 0; c < numHCols; c++)
      {
        new Gradebook.CellController(tableHeader.rows[0].cells[c], this, 0, c, true, numHCols);
      }
    }
    var numRows = this.table.rows.length;
    for ( var r = 0; r < numRows; r++)
    {
      var numCols = this.table.rows[0].cells.length;
      for (c = 0; c < numCols; c++)
      {
        var cell = this.table.rows[r].cells[c];
        new Gradebook.CellController(cell, this, r, c, false, numHCols);
      }
    }

    if (document.onKeydownHandler)
    {
      Event.stopObserving(document, 'keydown', document.onKeydownHandler);
    }
    document.onKeydownHandler = this.onDocumentKeyDownHandler.bindAsEventListener(this);
    Event.observe(document, 'keydown', document.onKeydownHandler);
  },

  unload: function() {
    GradebookScrollContext.getNewInstance( this.model, this.options.accessibleMode ).saveScrollCoordinates();

    // Update the latest model status to sessionStorage
    GradebookCache.setObject(GradebookCache.KEY_STORE, window.model.store);
    GradebookCache.setObject(GradebookCache.KEY_MINIMUM_ROW_NUM, window.model.minimumRows);
    GradebookCache.setObject( GradebookCache.KEY_COL_ORDER_MAP, this.model.colOrderMap );

    GradebookCache.setString( GradebookCache.KEY_SORT_COLUMN_BY_ASCENDING, this.model.sortColAscending );
    GradebookCache.setString( GradebookCache.KEY_SORT_COLUMN_BY, this.model.currentSortColumnBy );

    GradebookCache.setString(GradebookCache.KEY_SORT_COLUMN_ID, this.model.sortColumnId);
    GradebookCache.setString(GradebookCache.KEY_SORT_DIR, this.model.sortDir);

    GradebookCache.setString(GradebookCache.KEY_CURRENT_VIEW, this.model.currentView);

    GradebookCache.setString(GradebookCache.KEY_FILTER_CATEGORY, this.model.categoryFilter);
    GradebookCache.setString(GradebookCache.KEY_FILTER_STATUS, this.model.statusFilter);

    GradebookCache.setObject(GradebookCache.KEY_SORTED_USER_IDS, this.model.getSortedUserIds());
    GradebookCache.setObject(GradebookCache.KEY_VISIBLE_USER_IDS, this.model.getVisibleUserIds());

    GradebookCache.setObject( GradebookCache.KEY_GRID_IMAGES, this.model.gridImages );
    GradebookCache.setObject(GradebookCache.KEY_ISOLATED_STUDENT_ID, this.model.isolatedStudentId);

    var numRows = this.table.rows.length;
    var c, cell;
    for ( var r = 0; r < numRows; r++)
    {
      var numCols = this.table.rows[0].cells.length;
      for (c = 0; c < numCols; c++)
      {
        cell = this.table.rows[r].cells[c];
        if (cell.controller)
        {
          cell.controller.unload();
        }
      }
    }
    var tableHeader = $(this.table.id + '_header');
    if (tableHeader)
    {
      var numHCols = tableHeader.rows[0].cells.length;
      for (c = 0; c < numHCols; c++)
      {
        cell = tableHeader.rows[0].cells[c];
        if (cell.controller)
        {
          cell.controller.unload();
        }
      }
    }
    if (this.viewPort)
    {
      this.viewPort.unload();
    }
    this.model.removeModelListeners();
    this.table = null;
    this.model = null;
    this.viewPort = null;
    this.options = null;
    this.sortCell = null;
  },

  _sizeHTMLTable : function()
  {
    var tbl = this.table;
    var tableHeader = $(this.table.id + '_header');
    var numRows = 0;
    var numCols = 0;
    var numFrozenColumns = this.options.numFrozenColumns;
    var i;
    // presence of th impacts the calculation of the row height
    // so we remove it before the calculation occurs
    if (numFrozenColumns === 0)
    {
      for (i = 0; i < tbl.rows.length; i++)
      {
        tbl.rows[i].deleteCell(1);
        if ( tableHeader )
        {
          // no table header in accessible view
          tableHeader.rows[i].deleteCell(1);
        }
      }
      // region is now too small to display msg and count
      $("selectedRowMsg").style.display = 'none';
    }
    else
    {
      $("selectedRowMsg").style.display = 'inline';
    }
    if (this.options.accessibleMode)
    {
      numRows = this.model.getNumRows() + 1 ; //in accessible mode, the same table has the header and content
      numCols = this.model.getNumColDefs();
    }
    else
    {
      var cell = this.table.rows[this.table.rows.length - 1].cells[1]; // skip
                                                                        // checkbox
                                                                        // column
      cell.height = cell.offsetHeight;
      numRows = parseInt(this.options.tableHeight/cell.offsetHeight, 10);
      var minimumRows = this.model.getMinimumRows( );
      var totalRows = this.model.getNumRows();
      if ( numRows > totalRows )
      {
        // do not show more than we have
        numRows = totalRows;
      }
      else if ( minimumRows > numRows )
      {
        // we want to display more than what can be displayed, so let's extended what is displayed,
        // but no more than the actual total number of students (rows)
        numRows = (minimumRows > totalRows)?totalRows:minimumRows;
      }
      // we do not handle the case where minimumRows < numRows as minimumRows condition is met
      // (we do display more rows than the miminum number asked for)
      numCols = parseInt(this.options.tableWidth / cell.offsetWidth, 10);
    }

    // at least one non-frozen column must be shown
    if (numFrozenColumns + 1 >= numCols)
    {
      numFrozenColumns = numCols - 1;
      this.options.numFrozenColumns = numFrozenColumns;
    }

    // assumes the table has at least 1 row & 2 cols
    // the first column is a frozen column
    // the second column is a non-frozen column

    // clone frozen columns
    for (i = 0; i < numFrozenColumns - 1; i++)
    {
      this._cloneColumn(1); // skip check box column
    }

    // clone non-frozen columns
    var numNonFrozenColumns = numCols - numFrozenColumns - 1;
    for (i = 0; i < numNonFrozenColumns; i++)
    {
      this._cloneColumn(numFrozenColumns + 1); // skip check box column
    }

    var checkColumnWidth = this.table.rows[0].cells[0].offsetWidth;
    var visibleWidth = this.table.offsetWidth;
    this.avgColWidth = (visibleWidth - checkColumnWidth) / numCols;
    var frozenWidth = (numFrozenColumns * this.avgColWidth) + checkColumnWidth;
    if( GradebookUtil.isFirefox() )
    {
      $("selectedRows").style.width = frozenWidth - 2 + "px";
    }
    else if( GradebookUtil.isIE() )
    {
      $("selectedRows").style.width = frozenWidth - 8 + "px";
    }

    // clone rows
    var numRowsToAdd = numRows - tbl.rows.length;

    var rowToClone = tbl.rows[this.table.rows.length - 1];
    for (i = 0; i < numRowsToAdd; i++)
    {
      tbl.tBodies[0].appendChild(rowToClone.cloneNode(true));
    }

    // remove table rows if html table is bigger than numRows
    while (tbl.rows.length > numRows)
    {
      if (tbl.rows.length > 0)
      {
        tbl.deleteRow(tbl.rows.length - 1);
      }
    }

    // remove table columns if html table is bigger than model
    var allRows = tbl.rows;
    while (tbl.rows.length > 0 && tbl.rows[0].cells.length - 1 > this.model.getNumColDefs())
    {
      for (i = 0; i < allRows.length; i++)
      {
        if (allRows[i].cells.length > 1)
        {
          allRows[i].deleteCell(-1);
        }
      }
    }
    while (tableHeader && tableHeader.rows[0].cells.length - 1 > this.model.getNumColDefs())
    {
      tableHeader.rows[0].deleteCell(-1);
    }
  },

  _cloneColumn : function(colIndex)
  {
    var tbl = this.table;
    var i, origCell, newCell;
    for (i = 0; i < tbl.rows.length; i++)
    {
      origCell = tbl.rows[i].cells[colIndex];
      newCell = origCell.cloneNode(true);
      tbl.rows[i].insertBefore(newCell, origCell);
    }
    var tableHeader = $(this.table.id + '_header');
    if (tableHeader)
    {
      tbl = tableHeader;
      for (i = 0; i < tbl.rows.length; i++)
      {
        origCell = tbl.rows[i].cells[colIndex];
        newCell = origCell.cloneNode(true);
        tbl.rows[i].insertBefore(newCell, origCell);
      }
    }
  },

  getAbbrColIndexes : function()
  {
    if (!this.abbrColIndexes)
    {
      this.abbrColIndexes = [];
      /*
       * Add abbr attributes to specific columns to allow screen readers to
       * announce meaningful column headers based on the following rules:
       *
       * 1. If both first and last name are visible, use those. 2. If the
       * username is visible, use that. 3. If neither of the first cases pass,
       * use the first column as the header.
       */
      var lastNameColIndex = this.model.getVisibleColDefIndex('LN');
      var firstNameColIndex = this.model.getVisibleColDefIndex('FN');
      var userNameColIndex = this.model.getVisibleColDefIndex('UN');
      if (lastNameColIndex != -1 && firstNameColIndex != -1)
      {
        this.abbrColIndexes[ lastNameColIndex ] = true;
        this.abbrColIndexes[ firstNameColIndex ] = true;
      }
      else if (userNameColIndex != -1)
      {
        this.abbrColIndexes[ userNameColIndex ] = true;
      }
      else
      {
        this.abbrColIndexes.push[ 0 ] = true;
      }
    }
    return this.abbrColIndexes;
  },

  onDocumentClickHandler : function(evt)
  {
    if (document.ignoreOnClick || Gradebook.alertLightbox)
    {
      return;
    }
    Gradebook.CellController.prototype.closePopupsAndRestoreFocus(evt);
  },

  onDocumentKeyDownHandler : function(evt)
  {
    if (Gradebook.alertLightbox)
    {
      return;
    }
    if (!Gradebook.CellController.prototype.tableHasFocus)
    {
      return;
    }
    var ek = evt.keyCode;
    var visibleRowCount = this.viewPort.getNumVisibleRows();
    var deltaRow = 0;
    var deltaCol = 0;
    /*
     * the model grid cell index is R2L agnostic: thus moving right in L2R is
     * moving towards the next col (+1), while in R2L it is going towards the
     * previous col (-1).
     */
    switch (ek)
    {
      case (Event.KEY_LEFT):
        deltaCol = page.util.isRTL() ? 1 : -1;
        break;
      case (Event.KEY_RIGHT):
        deltaCol = page.util.isRTL() ? -1 : 1;
        break;
      case (Event.KEY_UP):
        deltaRow = -1;
        break;
      case (Event.KEY_DOWN):
        deltaRow = 1;
        break;
      case (33/* page up */):
        if (!this.options.accessibleMode)
        {
          deltaRow = -visibleRowCount;
        }
        break;
      case (34/* page down */):
        if (!this.options.accessibleMode)
        {
          deltaRow = visibleRowCount;
        }
        break;
      case (Event.KEY_TAB):
        if (!Gradebook.CellController.currentSelectedCell || !Element.descendantOf(evt.element(), Gradebook.CellController.currentSelectedCell.controller.htmlCell))
        {
          break;
        }
        if (evt.shiftKey)
        {
          if (!evt.element().hasClassName('cmimg') && !this.isFirstCell())
          {
            deltaCol = -1;
            break;
          }
        }
        else if (!this.isLastCell() && (evt.element().hasClassName('cmimg') || this.isCurrentCellWithoutMenu()))
        {
          deltaCol = 1;
        }
        break;
    }
    if (deltaRow === 0 && deltaCol === 0)
    {
      return;
    }
    else
    {
      if (evt)
      {
        Event.stop(evt);
      }
      this.selectRelativeCell(deltaRow, deltaCol);
      Gradebook.CellController.prototype.closePopups(evt);
    }
  },

  isLastCell : function()
  {
    if (!Gradebook.CellController.currentSelectedCell)
    {
      return false;
    }
    // last cell if it is the last displayed cell with no more scroll available
    // right or down
    var nextSelectedCol = Gradebook.CellController.currentSelectedCell.controller.col;
    var nextSelectedRow = Gradebook.CellController.currentSelectedCell.controller.row + 1;

    return (nextSelectedCol >= this.viewPort.numVisibleCols) && (nextSelectedRow >= this.viewPort.numVisibleRows) &&
       ((this.viewPort.lastRowPos/* offset */+ this.viewPort.numVisibleRows) == this.model.getNumRows()) &&
       ((this.viewPort.colOffset + this.viewPort.numVisibleCols) == this.model.getNumColDefs());
  },

  isFirstCell : function()
  {
    if (!Gradebook.CellController.currentSelectedCell)
    {
      return false;
    }
    return (Gradebook.CellController.currentSelectedCell.controller.col == 1/* checkbox */ &&
        Gradebook.CellController.currentSelectedCell.controller.row === 0 &&
        (!this.viewPort.scrollerDiv /* null if no vertical scroll */  || this.viewPort.scrollerDiv.scrollTop === 0 )
    );
  },

  isCurrentCellWithoutMenu : function()
  {
    // the only cell type that does not display a context menu are calculated
    // columns
    if (!Gradebook.CellController.currentSelectedCell)
    {
      return false;
    }
    var gridCell = Gradebook.CellController.currentSelectedCell.controller.getGridCell();
    if (!gridCell)
    {
      return true;
    }
    return gridCell.isGrade() && !gridCell.canEdit();
  },

  selectRelativeCell : function(deltaRow, deltaCol)
  {
    var visibleRowCount = this.viewPort.getNumVisibleRows();
    var visibleColumnCount = this.viewPort.getNumVisibleCols();
    var modelRowCount = this.model.getNumRows();
    var modelColumnCount = this.model.getNumColDefs();

    var cellController = this.currentCellController;
    if (Gradebook.CellController.currentSelectedCell)
    {
      cellController = Gradebook.CellController.currentSelectedCell.controller;
    }
    var currentSelectedRow = cellController.row;
    var currentSelectedCol = cellController.col - 1; // skip checkbox col
    var selectDelay = 100;

    currentSelectedRow += deltaRow;
    if (currentSelectedRow < 0 || currentSelectedRow >= visibleRowCount)
    {
      currentSelectedRow -= deltaRow;
      selectDelay = 500; // need longer delay to select cell until scroll
                          // completes
      if (!this.viewPort.scrollRows(deltaRow))
      {
        if (deltaRow < 0)
        {
          // wrap to bottom of previous col
          if (currentSelectedCol === 0)
          {
            return;
          }
          deltaRow = modelRowCount - visibleRowCount;
          currentSelectedRow = visibleRowCount - 1;
          currentSelectedCol -= 1;
        }
        else
        {
          // wrap to top of next col
          deltaRow = visibleRowCount - modelRowCount;
          currentSelectedRow = 0;
          if (currentSelectedCol < visibleColumnCount - 1)
          {
            currentSelectedCol += 1;
          }
          else
          {
            this.viewPort.scrollCols(1);
          }
        }
        this.viewPort.scrollRows(deltaRow);
      }
    }
    currentSelectedCol += deltaCol;
    if ((currentSelectedCol < this.options.numFrozenColumns && deltaCol < 0) || currentSelectedCol >= visibleColumnCount)
    {
      currentSelectedCol -= deltaCol;
      selectDelay = 500; // need longer delay to select cell until scroll
                          // completes
      if (!this.viewPort.scrollCols(deltaCol))
      {
        if (deltaCol < 0)
        {
          if (currentSelectedCol > 0)
          { // navigate in frozen columns
            currentSelectedCol += deltaCol;
          }
          else
          {
            // wrap to end of previous row
            if (currentSelectedRow === 0)
            {
              return;
            }
            deltaCol = modelColumnCount - visibleColumnCount;
            currentSelectedCol = visibleColumnCount - 1;
            currentSelectedRow -= 1;
          }
        }
        else
        {
          // wrap to beginning of next row
          deltaCol = visibleColumnCount - modelColumnCount;
          currentSelectedCol = 0;
          if (currentSelectedRow < visibleRowCount - 1)
          {
            currentSelectedRow += 1;
          }
          else
          {
            this.viewPort.scrollRows(1);
          }
        }
        this.viewPort.scrollCols(deltaCol);
      }
    }
    // select the current cell after servicing the main event loop to allow
    // current events to complete
    // this was needed for AS-110508 to apply the left/right arrow event to cell
    // navigation only and not to cell editing too.
    this.currentCellController = this.table.rows[currentSelectedRow].cells[currentSelectedCol + 1].controller;
    setTimeout(this.selectCell.bind(this), selectDelay);
  },

  selectCell : function()
  {
    this.currentCellController.selectCell();
  },

  sortColumn : function(newSortCell, sortDir)
  {
    if (newSortCell != this.sortCell)
    {
      this.sortDir = 'ASC';
      if (this.sortCell)
      {
        this.sortCell.setSortImage('NO_SORT'); // remove current sort image
      }
    }
    else
    {
      this.sortDir = (this.sortDir == 'ASC') ? 'DESC' : 'ASC'; // toggle
    }
    if (sortDir)
    {
      this.sortDir = sortDir;
    }
    this.sortCell = newSortCell;
    this.sortCell.setSortImage(this.sortDir); // show new sort image

    // sort the model
    this.modelSortIndex = this.viewPort.toModelIndex(this.sortCell.col - 1); // skip
                                                                              // checkbox
                                                                              // column
    this.model.sort(this.modelSortIndex, this.sortDir);

    // refresh the view
    this.viewPort.moveScroll(0);
    this.viewPort.refreshContents(0);
  },

  updateSortImage : function()
  {
    if (!this.viewPort)
    {
      return;
    }
    if (this.sortCell)
    {
      this.sortCell.setSortImage('NO_SORT'); // remove current sort image
    }
    var viewSortIndex = this.viewPort.toViewIndex(this.modelSortIndex);
    if (viewSortIndex < 0)
    {
      this.sortCell = null;
    }
    else
    {
      var headerTable = $(this.table.id + '_header');
      if (!headerTable)
      {
        return;
      }
      this.sortCell = headerTable.rows[0].cells[viewSortIndex + 1].controller; // add
                                                                                // 1 to
                                                                                // account
                                                                                // for
                                                                                // check
                                                                                // column
      this.sortCell.setSortImage(this.sortDir);
    }
  },

  updateNumSelectedIndicator : function()
  {
    var ids = this.model.getCheckedStudentIds();
    $("rowindicator").update(ids.length);
  },

  // focused is restored only in AX view since user has to leave the page for
  // update
  restoreFocus : function()
  {
    if (!this.options || !this.options.accessibleMode || !Gradebook.getModel().lastFocusedRow || !Gradebook.getModel().lastFocusedCol)
    {
      return;
    }
    if ( GradebookUtil.isIE() )
    {
      setTimeout(this.doRestoreFocus.bind(this), 0 );
    }
    else
    {
      this.doRestoreFocus();
    }
  },

  doRestoreFocus : function()
  {
    var lastFocusedRow = Gradebook.getModel().lastFocusedRow;
    var lastFocusedCol = Gradebook.getModel().lastFocusedCol;
    this.table.rows[lastFocusedRow].cells[lastFocusedCol].controller.selectCell();
    Gradebook.getModel().lastFocusedRow = null;
    Gradebook.getModel().lastFocusedCell = null;
  }

};

// Gradebook.GridViewPort --------------------------------------------------
Gradebook.GridViewPort = Class.create();

Gradebook.GridViewPort.prototype =
{

  initialize: function(table, model, options,grid)
  {
    this.isIE = GradebookUtil.isIE();
    this.isFF = GradebookUtil.isFirefox();
    this.table = table;
    this.model = model;
    this.options = options;
    this.grid = grid;
    this.lastPixelOffset = 0;
    this.colOffset = 0;
    this.lastRowPos = 0;
    this.startScrollLeft = 0;
    this.headerTableId = this.table.id + '_header';
    this.headerTable   = $(this.headerTableId);
    if (!this.headerTable)
    {
      this.headerTable = this.table;
    }
    this.numVisibleRows = this.table.rows.length;
    if ( this.headerTable.rows[0] )
    {
      this.numVisibleCols = this.headerTable.rows[0].cells.length-1; // don't include check column
    }
    this.div = this.table.parentNode;
    this.initScrollers();
    this.updateLastModifiedTS();
    this.restoreInteractiveModeScrollCoordinates();
    if ($('expandGradebookButton')) {
      Event.observe('expandGradebookButton', 'click', this.expandGradeBookGrid.bindAsEventListener(this));
    }
    //add class to max/min button if maximized to adjust poisiton in full screen mode
    if ($("content").hasClassName("expanded-gradebook")) {
      $("expandGradebookButton").addClassName("minimize-gradebook");
    }
    var body = document.getElementsByTagName( 'body' )[0]; 
    body.setAttribute( 'class', 'gradebook-body' );
  },

  //expand grade grid to full screen.
  expandGradeBookGrid: function() {
    var content = $("content");
    content.toggleClassName("expanded-gradebook");
    theGradeCenter.resizeGrid();
  },

  unload: function()
  {
    this.grid = null;
    this.model = null;
    this.table = null;
    this.headerTable = null;
    this.div = null;
    this.scrollerDiv = null;
    this.heightDiv = null;
    this.scrollerDivH  = null;
    this.widthDiv = null;
    this.options = null;
  },

  restoreInteractiveModeScrollCoordinates: function() {
    var gradebookScrollContext = GradebookScrollContext.getExistingInstance( this.model, this.options.accessibleMode );
    if ( !gradebookScrollContext || gradebookScrollContext.accessibleMode )
    {
      return;
    }
    if ( this.scrollerDiv )
    {
      this.scrollerDiv.scrollTop = gradebookScrollContext.inaccessibleScrollSettings.scrollTop;
    }

    this.lastVScrollPos = gradebookScrollContext.inaccessibleScrollSettings.lastVScrollPos;
    if ( this.scrollerDivH )
    {
      this.scrollerDivH.scrollLeft = gradebookScrollContext.inaccessibleScrollSettings.scrollLeft;
      this.setColOffsetFromScrollOffset();
    }
    this.lastHScrollPos = gradebookScrollContext.inaccessibleScrollSettings.lastHScrollPos;
    if ( this.scrollerDiv )
    {
      var contentOffset = parseInt( this.scrollerDiv.scrollTop / parseInt(this.rowHeight, 10), 10 );
      this.lastRowPos = contentOffset;
    }
  },

  modelChanged: function()
  {
    this.updateLastModifiedTS();
    this.refreshContentsH();
    this.grid.updateNumSelectedIndicator();
  },

  updateLastModifiedTS: function()
  {
    var t = this.model.lastLogEntryTS;
    if (!t)
    {
      return;
    }

    $( window.document.getElementById('timeStampDiv')).update( window.LastSavedMsg + t );
  },

  getHeaderGridCell: function(col)
  {
    if (col > 0)
    {
      col -= 1; // skip check col
    }
    if (col >= this.options.numFrozenColumns)
    {
      col += this.colOffset;
    }
    var iterator = this.model.getColDefIterator(col);
    if (!iterator || !iterator.hasNext())
    {
      GradebookUtil.error('getHeaderGridCell cannot get header cell for col: '+col);
    }
    return iterator.next();
  },

  getNumVisibleRows: function()
  {
    return this.numVisibleRows;
  },

  getNumVisibleCols: function() {
    return this.numVisibleCols;
  },

  populateRow: function(htmlRow, frozenColRowIterator, scrollableColRowIterator)
  {
    var numFrozenColumns = this.options.numFrozenColumns;
    for (var j=0; j < (this.numVisibleCols); j++)
    {
      var iterator = (j < numFrozenColumns)?frozenColRowIterator:scrollableColRowIterator;
      var dataCell = iterator.next();
      var htmlCell = htmlRow.cells[j+1];
      // set check box column based on isRowChecked flag for first data cell
      if (j === 0)
      {
        var checkInput = GradebookUtil.getChildElementByClassName(htmlRow.cells[0], 'input', 'checkInput');
        checkInput.checked = dataCell.metaData.isRowChecked;
      }
      htmlCell.controller.renderHTML(dataCell);
    }
  },

  refreshContents: function(rowOffset)
  {
    if (this.model.getNumRows() === 0)
    {
      return;
    }
    if (this.options.accessibleMode)
    {
      this.refreshAccessibleContents();
      return;
    }
    var numRows = this.numVisibleRows;
    var numModelRows = this.model.getNumRows();
    if (rowOffset + numRows > numModelRows)
    {
      rowOffset = numModelRows - numRows - 1;
    }
    var numFrozenColumns = this.options.numFrozenColumns;
    var frozenColRowIterators = this.model.getRowIterators(rowOffset, numRows, 0);
    var scrollableColRowIterators = frozenColRowIterators;
    if (this.numVisibleCols > numFrozenColumns)
    {
      scrollableColRowIterators = this.model.getRowIterators(rowOffset, numRows, numFrozenColumns+this.colOffset);
    }
    for (var i=0; i < numRows; i++)
    {
      this.populateRow(this.table.rows[i], frozenColRowIterators[i], scrollableColRowIterators[i]);
    }
    this.lastRowPos = rowOffset;
  },

  restorePreviousAccessibleModeScrollCoordinates: function()
  {
    var gradebookScrollContext = GradebookScrollContext.getExistingInstance( this.model, this.options.accessibleMode );
    if ( gradebookScrollContext && gradebookScrollContext.accessibleMode )
    {
      var accessibleContainer = document.getElementById('table1_accessible_container');
      accessibleContainer.scrollTop = gradebookScrollContext.accessibleScrollSettings.y;
      accessibleContainer.scrollLeft = gradebookScrollContext.accessibleScrollSettings.x;
    }
  },

  refreshAccessibleContents : function()
  {
    var numModelRows = this.model.getNumRows();
    var iters = this.model.getRowIterators();
    var numCols = this.table.rows[0].cells.length - 1; // skip check column
    var start = new Date().getTime();
    if (this.refreshRowCounter === undefined || this.refreshRowCounter === null)
    {
      this.refreshRowCounter = 0;
    }
    var abbrColIndexes = this.grid.getAbbrColIndexes();
    for ( var i = this.refreshRowCounter; i < numModelRows; i++)
    {
      var htmlRowIndex = i + 1; // skip header row
      var htmlRow = this.table.rows[htmlRowIndex];
      var htmlCell;
      // if we are rendering for more than 3 seconds, give Firefox some time to
      // get
      // rid of the "unresponsive script" message.
      if (new Date().getTime() - start > 3000)
      {
        setTimeout(this.refreshAccessibleContents.bind(this), 0);
        return;
      }
      var rowTitle = GradebookUtil.getMessage('selectUserMsg');
      for ( var j = 0; j < numCols; j++)
      {
        var dataCell = iters[i].next();
        htmlCell = htmlRow.cells[j + 1]; // skip check column
        if (!htmlCell.controller)
        {
          new Gradebook.CellController(htmlCell, this.grid, htmlRowIndex, j + 1, false /* not a header cell */ );
        }
        htmlCell.controller.renderHTML(dataCell);
        if ( abbrColIndexes[ j ] )
        {
          htmlCell.abbr = htmlCell.controller.getGridCell().getValue();
          htmlCell.scope = 'row';
          rowTitle += " " + htmlCell.controller.getGridCell().getValue();
        }
        // set check box column based on isRowChecked flag for first grid cell
        if (j === 0)
        {
          htmlCell = htmlRow.cells[0];
          if (!htmlCell.controller)
          {
            new Gradebook.CellController(htmlCell, this.grid, htmlRowIndex, j, false /* not a header cell */ );
          }
          var checkInput = $(htmlCell).down('input');
          checkInput.checked = dataCell.metaData.isRowChecked;
        }
      }
      $(htmlRow.cells[0]).down('input').title = rowTitle;

      this.refreshRowCounter++;
    }
    this.refreshRowCounter = null;
    setTimeout(this.restorePreviousAccessibleModeScrollCoordinates.bind(this), 0 );
  },

  refreshContentsH : function()
  {
    // refresh data cells
    this.refreshContents(this.lastRowPos);
    // refresh the header cells
    var numFrozenColumns = this.options.numFrozenColumns;
    var hdrCells = null;
    var hdr = $(this.table.id + '_header');
    if (hdr)
    {
      hdrCells = hdr.rows[0].cells;
    }
    else
    {
      hdrCells = this.table.rows[0].cells;
    }
    if (!hdrCells)
    {
      return;
    }
    var frozenColIterator = this.model.getColDefIterator(0);
    var scrollableColIterator = null;
    if (this.numVisibleCols > numFrozenColumns)
    {
      scrollableColIterator = this.model.getColDefIterator(numFrozenColumns + this.colOffset);
    }
    if (!hdrCells[0].controller)
    {
      var ctrl = new Gradebook.CellController(hdrCells[0], this.grid, 0, 0, true);
      if (this.options.accessibleMode)
      {
        ctrl._accessibleInit();
      }
    }
    for ( var i = 0; i < this.numVisibleCols; i++)
    {
      var iterator = (i < numFrozenColumns) ? frozenColIterator : scrollableColIterator;
      var htmlCell = hdrCells[i + 1]; // skip check column
      var colDef = iterator.next();
      if (!htmlCell.controller)
      {
        new Gradebook.CellController(htmlCell, this.grid, 0, i + 1, true);
      }
      htmlCell.controller.renderHeaderCellHTML(colDef);
    }
    // add the check all listener if not present
    if (!hdrCells[0].controller)
    {
      new Gradebook.CellController(hdrCells[0], this.grid, 0, 0, true);
    }
    this.grid.updateSortImage();
  },

  visibleHeight : function()
  {
    return parseInt(GradebookUtil.getElementsComputedStyle(this.div, 'height'), 10);
  },

  toViewIndex : function(modelSortIndex)
  {
    var numFrozenColumns = this.options.numFrozenColumns;
    if (modelSortIndex < numFrozenColumns)
    {
      return modelSortIndex;
    }
    var vi = (modelSortIndex - this.colOffset);
    if (numFrozenColumns <= vi && vi < this.numVisibleCols)
    {
      return vi;
    }
    else
    {
      return -1;
    }
  },

  toModelIndex : function(viewSortIndex)
  {
    if (viewSortIndex == -1)
    {
      return -1;
    }

    var numFrozenColumns = this.options.numFrozenColumns;
    var mi = (viewSortIndex < numFrozenColumns) ? viewSortIndex : (this.colOffset + viewSortIndex);
    return mi;
  },

  // scrolling management

  initScrollers : function()
  {
      this.createVScrollBar();
      this.createHScrollBar();
      this.lastVScrollPos = 0;
      if (this.scrollerDivH)
      {
        this.lastHScrollPos = this.scrollerDivH.scrollLeft;
      }
      else
      {
        this.lastHScrollPos = 0;
      }
      this.startScrollLeft = this.lastHScrollPos;
  },

  createVScrollBar : function()
  {
    // see comments on createHScroolBar()
    if (this.table.rows.length >= this.model.getNumRows())
    {
      return;
    }
    var visibleHeight = this.visibleHeight();
    // rule of third: we have X rows to display, only Y are visible
    // and the height for the Y is visibleHeight, what should be the
    // height for all? totalHeight = ( visibleHeight / Y ) * X
    var numVisibleRows = this.table.rows.length;
    this.rowHeight = parseInt(visibleHeight / numVisibleRows, 10);
    visibleHeight = this.rowHeight * numVisibleRows; // just in case rowHeight
                                                     // was rounded
    if( this.isFF )
    {
      visibleHeight -= 1;
    }
    if( this.isIE )
    {
      visibleHeight += 2;
    }
    var divHeight = this.rowHeight * this.model.getNumRows();

    // create the outer div...
    this.scrollerDiv = document.createElement("div");
    var scrollerStyle = this.scrollerDiv.style;
    scrollerStyle.borderRight = this.options.scrollerBorderRight;
    scrollerStyle.position = "absolute";
    var tableWidth = this.isIE ? this.table.offsetWidth - 3 + "px" : this.table.offsetWidth - 5 + "px";
    var bodyWidth = $(document.body).getWidth();
    var windowWidth = window.innerWidth;
    
    if (document.documentElement.dir == 'rtl')
    {
        scrollerStyle.left = "0px";
    }
    else
    {
        scrollerStyle.right = "0px";
    }
    
    scrollerStyle.top = "1px";
    scrollerStyle.height = this.isFF ? visibleHeight + "px" : visibleHeight - 1 +"px";
    scrollerStyle.overflowY = "scroll";

    // create the inner div...
    this.heightDiv = document.createElement("div");
    this.heightDiv.style.width = "1px";

    this.heightDiv.style.height = parseInt(divHeight, 10) + "px";
    this.scrollerDiv.appendChild(this.heightDiv);
    Event.observe(this.scrollerDiv, 'scroll', this.handleVScroll.bindAsEventListener(this));

    this.table.parentNode.parentNode.insertBefore(this.scrollerDiv, this.table.parentNode.nextSibling);
    var eventName = this.isIE ? "mousewheel" : "DOMMouseScroll";
    Event.observe(this.table, eventName, function(evt)
    {
      if (evt.wheelDelta >= 0 || evt.detail < 0) // wheel-up
        {
          this.scrollerDiv.scrollTop -= (2 * this.rowHeight);
        }
        else
        {
          this.scrollerDiv.scrollTop += (2 * this.rowHeight);
        }
        this.handleVScroll();
      }.bindAsEventListener(this), false);
  },

  createHScrollBar : function()
  {
    // logic here is to create an div the same width that the non frozen
    // columns
    // then put inside it an invisible inner div that would be the width of
    // the non
    // frozen if they were all visible; by setting the parent with overflow:
    // auto
    // scroll bars will appear, and the scrolling events are captured to decide
    // what
    // portion of the table should be displayed.
    if (!this.headerTable.rows[0] || this.headerTable.rows[0].cells.length > this.model.getNumColDefs())
    {
      return;
    }
    var totalColumnCount = this.model.getNumColDefs();
    var visibleColumnCount = this.numVisibleCols;
    var numFrozenColumns = this.options.numFrozenColumns;
    this.maxColOffset = totalColumnCount - (visibleColumnCount - numFrozenColumns);

    var visibleHeight = this.isFF ? this.table.offsetHeight - 1 : this.table.offsetHeight - 2;
    var checkColumnWidth = this.headerTable.rows[0].cells[0].offsetWidth;
    // set avg col width to be based on actual cell width (not including
    // padding, etc.)
    // this will allow scrolling to be more accurate
    this.avgColWidth = this.headerTable.rows[0].cells[1].offsetWidth;
    var frozenWidth = (numFrozenColumns * this.avgColWidth) + checkColumnWidth;
    var visibleWidth = (visibleColumnCount - numFrozenColumns) * this.avgColWidth;

    // create the outer div...
    this.scrollerDivH = document.createElement("div");
    var scrollerStyle = this.scrollerDivH.style;
    scrollerStyle.position = "absolute";
    if (document.documentElement.dir == 'rtl')
    {
      if( this.isFF )
      {
        scrollerStyle.right = frozenWidth + "px";
      }
      else if( this.isIE )
      {
        scrollerStyle.right = frozenWidth + 4 + "px";
      }
      else
      {
        scrollerStyle.right = frozenWidth + 3 + "px";
      }
    }
    else
    {
      if( this.isFF )
      {
        scrollerStyle.left = frozenWidth + "px";
      }
      else if( this.isIE )
      {
        scrollerStyle.left = frozenWidth - 4 + "px";
      }
      else
      {
        scrollerStyle.left = frozenWidth - 3 + "px";
      }
    }

    scrollerStyle.top = visibleHeight + 3 + "px";
    scrollerStyle.width = visibleWidth + "px";
    scrollerStyle.overflowX = "scroll";

    // create the inner div...
    this.widthDiv = document.createElement("div");
    this.widthDiv.style.height = "1px";
    this.widthDiv.style.direction = 'ltr';
    this.widthDiv.style.width = (this.avgColWidth * (totalColumnCount - numFrozenColumns)) + "px";
    this.scrollerDivH.appendChild(this.widthDiv);
    Event.observe(this.scrollerDivH, 'scroll', this.handleHScroll.bindAsEventListener(this));

    if (this.scrollerDiv)
    {
      this.table.parentNode.parentNode.insertBefore(this.scrollerDivH, this.scrollerDiv.nextSibling);
    }
    else
    {
      this.table.parentNode.parentNode.insertBefore(this.scrollerDivH, this.table.parentNode.nextSibling);
    }
    //Scrolling Hint Logic starts Here
    // Find the first parent of containerdiv which sets the positioning reference (either relative or absolute)
    var relativePositionElement = $( 'containerdiv' );
    while ( relativePositionElement )
    {
      var position = relativePositionElement.getStyle( 'position' );
      if ( position && ( position == 'relative' || position == 'absolute' ) )
      {
        break; // we found the element used to a the origin for any positioning
      }
      relativePositionElement = relativePositionElement.up( );
    }
    var positionOffset = relativePositionElement.cumulativeOffset();
    // if those values change, then that means the scroll bar is redrawn so we can do it outside
    var scrollArrowButtonOffset = 12; // the [<]xxxxxxx[>] arrows, not sure we can actually get their actual width since this is browser widget
    var startX = -1, startY = -1, endY = -1;
    var scrollBarWidth = visibleWidth - 2*scrollArrowButtonOffset;
    var isR2L = page.util.isRTL();
    var columnHint = function( event )
    {
      if ( !this.scrollerDivH || !$('selectedRows') ) return;
      if ( startX < 0 )
      {
        if ( isR2L )
        {
          startX = this.scrollerDivH.cumulativeOffset( ).left + scrollArrowButtonOffset;
          startY = $('selectedRows').cumulativeOffset().top;
          endY = startY + $('selectedRows').offsetHeight;
        }
        else
        {
          startX = this.scrollerDivH.cumulativeOffset( ).left + scrollArrowButtonOffset;
          startY = $('selectedRows').cumulativeOffset().top;
          endY = startY + $('selectedRows').offsetHeight;
        }
      }
      var x = event.pointerX( );
      var y = event.pointerY( );
      var hintbox = $( 'hintbox' );
      if ( x > startX && y > startY && y < endY )
      {
        if ( !hintbox )
        {
          hintbox = document.createElement("div");
          hintbox.id = 'hintbox';
          hintbox.className = 'scrollHint';
          $('containerdiv').appendChild( hintbox );
        }
        var xOffset = x - startX;
        var colOffset = (isR2L?1:numFrozenColumns) + Math.floor( ( xOffset / scrollBarWidth ) * ( totalColumnCount - numFrozenColumns )  );
        var col = this.model.getColumnByIndex( isR2L?( totalColumnCount - colOffset ):colOffset );
        if ( col )
        {
          hintbox.innerHTML = col.getName( );
          var hintLeft = ( x - positionOffset.left );
          hintbox.style.left = hintLeft + 'px';
          hintbox.style.top  = ( y - positionOffset.top + 20 ) + 'px';
          hintbox.show( );
          var bodyWidth = $(document.body).getWidth();
          var hintwidth = $(hintbox).getWidth();
          if (hintLeft + hintwidth > bodyWidth)
          {
            hintLeft = bodyWidth - hintwidth;
            hintbox.style.left = hintLeft + 'px';
          }
        }
        else
        {
          $( 'hintbox' ).innerHTML = '';
          hintbox.hide( );
        }
      }
      else
      {
        if ( hintbox )
        {
          hintbox.hide( );
        }
      }
    };
    $('containerdiv').observe('mousemove', columnHint.bind( this ) );
    $('containerdiv').observe('mousedown', function( ) { if ( $( 'hintbox' ) ) $( 'hintbox' ).hide( ); } );
    // End Of Hint related logic
  },

   rowToPixel : function(rowOffset)
  {
    return (rowOffset / this.model.getNumRows()) * this.heightDiv.offsetHeight;
  },

  moveScroll : function(rowOffset)
  {
    if (this.scrollerDiv)
    {
      this.scrollerDiv.scrollTop = this.rowToPixel(rowOffset);
    }
  },

  /* When scrolling, IE sends multiple onscroll events for a single scroll action by the user.
     To get around this, we set a timer and wait until the dust settles before doing the scroll
     Here is info on the work around: http://support.microsoft.com/kb/238004
  */
  // scroll numRows, can be negative. returns false if scroll request is out of range
  scrollRows : function(numRows)
  {
    if (!this.scrollerDiv)
    {
      return false;
    }
    if ((numRows < 0 && this.scrollerDiv.scrollTop === 0) || (numRows > 0 && this.lastRowPos == (this.model.getNumRows() - this.numVisibleRows)))
    {
      return false;
    }
    this.ignoreOnVscroll = true;
    this.scrollerDiv.scrollTop += (numRows * this.rowHeight);
    setTimeout(this.doVScroll.bind(this), 200 );
    return true;
  },

  handleVScroll : function(evt)
  {
    if ( this.ignoreOnVscroll || Gradebook.alertLightbox )
    {
      return;
    }
    this.ignoreOnVscroll = true;
    setTimeout(this.doVScroll.bind(this), 200);
  },

  doVScroll : function()
  {
    var incomingscrollTop = this.scrollerDiv.scrollTop;
    var scrollDiff = this.lastVScrollPos - this.scrollerDiv.scrollTop;
    if (scrollDiff !== 0.00)
    {
      // Only tell the cellcontroller if we're actually going to do something.
      Gradebook.CellController.prototype.onGridScroll();
      var r = this.scrollerDiv.scrollTop % this.rowHeight;
      if (r !== 0)
      {
        if (scrollDiff < 0)
        {
          this.scrollerDiv.scrollTop += (this.rowHeight - r);
        }
        else
        {
          this.scrollerDiv.scrollTop -= r;
        }
      }
      var contentOffset = Math.round(parseInt(this.scrollerDiv.scrollTop, 10) / parseInt(this.rowHeight, 10));
      this.refreshContents(contentOffset);
      this.lastVScrollPos = this.scrollerDiv.scrollTop;
    }
    this.ignoreOnVscroll = false;
  },

  handleHScroll : function(evt)
  {
    if (this.ignoreOnHscroll || Gradebook.alertLightbox )
    {
      return;
    }
    this.ignoreOnHscroll = true;
    setTimeout(this.doHScroll.bind(this), 200);
  },

  // scroll numCols, can be negative. returns false if scroll request is out of
  // range
  scrollCols : function(numCols)
  {
    if (!this.scrollerDivH)
    {
      return false;
    }
    var totalColumnCount = this.model.getNumColDefs();

    if ((numCols < 0 && this.scrollerDivH.scrollLeft === 0) || (numCols > 0 && this.colOffset == (this.model.getNumColDefs() - this.numVisibleCols)))
    {
      return false;
    }
    this.ignoreOnHscroll = true;
    /*
     * so here we need to translate delta to actual scroll value. The delta is
     * screen orientation agnostic (we need to move to that col in the model) we
     * need to translate the move in a pixel move to the left: a move to the
     * left in l2r means we move to the next col, while in r2l it means we move
     * to previous col, thus the inversion of orientation if r2l.
     */
    this.scrollerDivH.scrollLeft += (numCols * this.avgColWidth * (page.util.isRTL() ? -1 : 1));
    setTimeout(this.doHScroll.bind(this), 200);
    return true;
  },

  doHScroll : function()
  {
    var scrollDiff = this.lastHScrollPos - this.scrollerDivH.scrollLeft;
    if (scrollDiff !== 0.00)
    {
      // Only tell the cellcontroller if we're actually going to do something.
      var done = Gradebook.CellController.prototype.onGridScroll();
      if(done)
      {
        // To align the column scroll - we move by column increment
        var r = this.scrollerDivH.scrollLeft % this.avgColWidth;
        if (r !== 0)
        {
          r = Math.abs(r);
          if (scrollDiff < 0)
          {
            this.scrollerDivH.scrollLeft += (this.avgColWidth - r);
          }
          else
          {
            this.scrollerDivH.scrollLeft -= r;
          }
        }
        this.setColOffsetFromScrollOffset();
        this.refreshContentsH();
        this.lastHScrollPos = this.scrollerDivH.scrollLeft;
      }
    }
    this.ignoreOnHscroll = false;
  },

  setColOffsetFromScrollOffset: function()
  {
    var offset = 0;
    if ( document.documentElement.dir == 'rtl' )
    {
      // Subtract the max scroll left with the current one and divide with the avgColWidth
      offset = Math.round( (this.startScrollLeft - this.scrollerDivH.scrollLeft) / this.avgColWidth);
      if (offset < 0)
      {
        // IE8 Standards mode generates a negative offset with the above logic, but IE7 does not.
        // In an attempt to resolve this without figuring out every single line of this fake scrolling
        // support, let's go with the number that works in this case.
        offset = Math.round(this.scrollerDivH.scrollLeft / this.avgColWidth);
      }
    }
    else
    {
      offset = Math.round(this.scrollerDivH.scrollLeft / this.avgColWidth);
    }
    this.colOffset = Math.min( offset, this.maxColOffset );
  },

  selectCell: function( modelLoc )
  {
    if ( modelLoc.col >= this.options.numFrozenColumns && modelLoc.col < this.options.numFrozenColumns + this.colOffset )
    {
      this.colOffset = modelLoc.col - this.options.numFrozenColumns;
    }
    else if ( modelLoc.col >= this.options.numFrozenColumns && modelLoc.col >= this.colOffset + this.numVisibleCols )
    {
      this.colOffset = modelLoc.col - this.numVisibleCols + 1;
    }

    if ( modelLoc.row < this.lastRowPos )
    {
      this.lastRowPos = modelLoc.row;
    }
    else if ( modelLoc.row >= this.lastRowPos + this.numVisibleRows )
    {
      this.lastRowPos = modelLoc.row - this.numVisibleRows + 1;
    }
    this.scrollerDivH.scrollLeft = this.avgColWidth * this.colOffset * (page.util.isRTL() ? -1 : 1);
    this.scrollerDiv.scrollTop = parseInt(this.rowHeight, 10) * this.lastRowPos;
    this.refreshContentsH();
    var row = modelLoc.row - this.lastRowPos;
    var col = ( modelLoc.col < this.options.numFrozenColumns ) ? modelLoc.col : modelLoc.col - this.colOffset;
    var htmlCell = this.table.rows[row].cells[col+1];
    htmlCell.controller.selectCell.bind( htmlCell.controller )();
  }

};
/**
 *  Gradebook data grid
 *
 *  PORTIONS OF THIS FILE ARE BASED ON RICO LIVEGRID 1.1.2
 *
 *  Copyright 2005 Sabre Airline Solutions
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 *  file except in compliance with the License. You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the
 *  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 *  either express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 *
 *  @author "Bill Richard"
 *  @version
 *
 **/

// Gradebook.GridService -----------------------------------------------------
function detach(n, u, w, h)
{
  var lpix = screen.width - w;
  var remote = window.open(u, n, 'width=' + w + ',height=' + h + ',resizable=yes,scrollbars=yes,status=no,top=20,left=' + lpix);
  if (remote)
  {
    remote.focus();
    if (!remote.opener)
    {
      remote.opener = self;
    }
    window.top.name = 'bbWin';
  }
}

Gradebook.GridService = Class.create();

Gradebook.GridService.prototype =
{

  initialize : function(courseId)
  {
    this.courseId = courseId;
    this.getDataURL = '/webapps/gradebook/do/instructor/getJSONData?course_id=' + this.courseId;
    this.deleteColumnURL = '/webapps/gradebook/do/instructor/deleteItem?course_id=' + this.courseId;
    this.adaptiveReleaseColumnURL = '/webapps/blackboard/execute/course/courseMapPicker?displayMode=dashboardMap&course_id=' + this.courseId;
    this.editContentURL = '/webapps/gradebook/do/instructor/goto?dispatch=editContent&course_id=' + this.courseId;
    this.modifyColumnURL = '/webapps/gradebook/do/instructor/addModifyItemDefinition?actionType=modify&course_id=' + this.courseId;
    this.modifyCumulativeColumnURL = '/webapps/gradebook/do/instructor/manageCumulativeItem?dispatch=addModifyFormulaItem&course_id=' + this.courseId;
    this.gradeDetailsURL = '/webapps/gradebook/do/instructor/viewGradeDetails?course_id=' + this.courseId;
    this.clearAttemptsURL = '/webapps/gradebook/do/instructor/clearAttempt?courseMembershipId=-1&course_id=' + this.courseId;
    this.viewItemStatsURL = '/webapps/gradebook/do/instructor/viewItemStats?course_id=' + this.courseId;
    this.viewStudentStatsURL = '/webapps/gradebook/do/instructor/viewStudentStats?course_id=' + this.courseId;
    this.getMessagesURL = '/webapps/gradebook/gradebook2/instructor/model_messages.jsp?course_id=' + this.courseId;
    this.runReportURL = '/webapps/blackboard/execute/reporting/displayDefinitions?nav_bridge=cp_gradebook2_learner_statistics_report&report_type=learner.statistics&course_id=' + this.courseId;
    this.reconcileGradesURL =  "/webapps/gradebook/controller/reconcileGrades?course_id=" +  this.courseId;
    this.informationAttemptsInfoUrl =  "/webapps/gradebook/do/instructor/getJSONUniqueAttemptData?course_id=" +  this.courseId;
  },

  requestLoadData : function(onSuccessCallBack, onFailureCallBack, onExceptionCallBack, forceFlush)
  {
    var url = this.getDataURL;
    if (forceFlush)
    {
      url += "&flush=true";
    }
    new Ajax.Request(url,
    {
      method : 'get',
      onSuccess : onSuccessCallBack,
      onFailure : onFailureCallBack,
      onException : onExceptionCallBack,
      requestHeaders :
        [ 'cookie', document.cookie ]
    });
  },

  requestLoadMessages : function(onSuccessCallBack, onFailureCallBack, onExceptionCallBack)
  {
    var url = this.getMessagesURL;
    new Ajax.Request(url,
    {
      method : 'get',
      onSuccess : onSuccessCallBack,
      onFailure : onFailureCallBack,
      onException : onExceptionCallBack,
      requestHeaders :
        [ 'cookie', document.cookie ]
    });
  },

  makeAjaxRequest : function(url, callBack)
  {
    new Ajax.Request(url,
    {
      method : 'get',
      onSuccess : callBack,
      requestHeaders :
        [ 'cookie', document.cookie ]
    });
  },
  
  getInformationBarAttemptsInfo : function(itemId, callBack)
  {
    var url = this.informationAttemptsInfoUrl + '&itemId=' + itemId;
    new Ajax.Request(url,
    {
      method : 'get',
      onSuccess : callBack,
      requestHeaders :
        [ 'cookie', document.cookie ],
      asynchronous: false
    } );
  },

  requestUpdateData : function(version, lastUserChangeTS, usersHash, scoreProvidersHash, customViewId, onSuccessCallBack, onFailureCallBack, onExceptionCallBack)
  {
    var url = this.getDataURL;
    
    // Make sure query variables that should be numeric are numeric before adding  them as query string values.
    // Check using the isNaN function which returns true for values that cannot be converted to numbers (e.g. int, float).
    if ( version !== null && !isNaN( version ) )
    {
      url = url + '&version=' + version;
    }
    
    if ( lastUserChangeTS !== null && !isNaN( lastUserChangeTS ) )
    {
      url = url + '&lastUserChangeTS=' + lastUserChangeTS;
    }
    
    if ( usersHash !== null && !isNaN( usersHash ) )
    {
      url = url + '&usersHash=' + usersHash;
    }
    
    if ( scoreProvidersHash !== null && !isNaN( scoreProvidersHash ) )
    {
      url = url + '&scoreProvidersHash=' + scoreProvidersHash;
    }

    if (customViewId)
    {
      url += '&customViewId=' + customViewId;
    }
    new Ajax.Request(url,
    {
      method : 'get',
      onSuccess : onSuccessCallBack,
      onFailure : onFailureCallBack,
      requestHeaders :
        [ 'cookie', document.cookie ],
      onException : onExceptionCallBack
    });
  },

  updateGrade : function(callback, bookVersion, newValue, newTextValue, userId, colDefId)
  {
    GradebookDWRFacade.updateGrade(parseInt(this.getCourseId(), 10), parseInt(bookVersion, 10), (newValue.length > 0) ? parseFloat(newValue) : newValue,
        newTextValue, parseInt(userId, 10), parseInt(colDefId, 10), callback);
  },

  clearAll : function(callback, bookVersion, isDelete, userId, colDefId)
  {
    GradebookDWRFacade.clearAll(parseInt(this.getCourseId(), 10), parseInt(bookVersion, 10), isDelete, parseInt(userId, 10), parseInt(colDefId, 10), callback);
  },

  clearSelected : function(callback, bookVersion, attemptIds, isDelete, userId, colDefId)
  {
    GradebookDWRFacade.clearSelected(parseInt(this.getCourseId(), 10), parseInt(bookVersion, 10), attemptIds, isDelete, parseInt(userId, 10), parseInt(
        colDefId, 10), callback);
  },

  deleteColumn : function(colDefId)
  {
    var frm = document.deleteColumnForm;
    frm.itemId.value = colDefId;
    frm.submit();
    //var url = this.deleteColumnURL + "&itemId="+colDefId;
    //window.location.href = url;
  },

  viewItemStats : function(itemId)
  {
    var url = this.viewItemStatsURL + "&itemId=" + itemId;
    window.location.href = url;
  },

  viewStudentStats : function(userId)
  {
    var url = this.viewStudentStatsURL + "&userId=" + userId;
    window.location.href = url;
  },

  runReport : function(userId)
  {
    var url = this.runReportURL + "&user_id=" + userId;
    window.location.href = url;
  },

  modifyColumn : function(colDefId, colType)
  {
    var url = this.modifyColumnURL + '&id=' + colDefId;
    if (colType != 'N')
    {
      url = this.modifyCumulativeColumnURL + '&itemId=' + colDefId;
    }

    window.location.href = url;
  },
  
  reconcileGrades : function(colDefId, colType)
  {
    var url = this.reconcileGradesURL + '&id=' + colDefId;
    window.location.href = url;
  },

  viewAdaptiveRelease : function( institutionUserId )
  {
    var url = this.adaptiveReleaseColumnURL + '&user_id=' + institutionUserId;
    detach('newwin', url, '350', '350');
  },

  showGradeDetails : function(userId, colDefId, focusCellId, isCanGrade)
  {
    /* AS-109344: Need to make sure the outcomeDefinitionId & courseMembershipId are same when coming back from the view attempt page for building block */
    var url = this.gradeDetailsURL + '&outcomeDefinitionId=_' + colDefId + '_1&courseMembershipId=_' + userId + '_1&focus_cell_id=' + focusCellId + "&isCanGrade=" + isCanGrade;
    window.location.href = url;
  },

  // TODO - why are these fieldids passed in?  There is apparently only one caller and they never change...
  // The newer logic around the vtbe and the readonly view assumes the single use-case field and div names
  loadComments: function(userId, itemId, studentCommentFieldId, instructorCommentFieldId)
  {
    var svc = this;
    $('readOnlyStudentComments').hide();
    $('readOnlyInstructorComments').hide();
    $('instructorCommentsTextDiv').hide();
    $('studentCommentsTextDiv').hide();
    GradebookDWRFacade.getComments(parseInt(this.getCourseId(), 10), userId, itemId, function(comments) {
      svc.studentComment = comments.studentComment;
      svc.instructorComment = comments.instructorComment;
      dwr.util.setValue(studentCommentFieldId, comments.studentComment);
      dwr.util.setValue(instructorCommentFieldId, comments.instructorComment);
      if (comments.studentComment.indexOf('<') != -1)
      {
        $('readOnlyStudentComments').update(comments.studentComment);
        $('readOnlyStudentComments').show();
        $('studentCommentsTextDiv').hide();
      }
      else
      {
        $('readOnlyStudentComments').hide();
        $('studentCommentsTextDiv').show();
      }
      if (comments.instructorComment.indexOf('<') != -1)
      {
        $('readOnlyInstructorComments').update(comments.instructorComment);
        $('readOnlyInstructorComments').show();
        $('instructorCommentsTextDiv').hide();
      }
      else
      {
        $('readOnlyInstructorComments').hide();
        $('instructorCommentsTextDiv').show();
      }
    });
  },

  loadAttemptsInfo : function(userId, itemId, callback)
  {
    GradebookDWRFacade.getAttemptsInfo(parseInt(this.getCourseId(), 10), userId, itemId, callback);
  },

  setComments : function(userId, itemId, studentComments, instructorComments)
  {
    if ( this.studentComment == studentComments && this.instructorComment == instructorComments )
    {
      return;
    }
    GradebookDWRFacade.setComments(parseInt(this.getCourseId(), 10), userId, itemId, studentComments, instructorComments,
        this.studentComment != studentComments, this.instructorComment != instructorComments);
  },

  setExemption : function(callback, bookVersion, userId, itemId, exempt)
  {
    GradebookDWRFacade.setExemption(parseInt(this.getCourseId(), 10), parseInt(bookVersion, 10), parseInt(userId, 10), parseInt(itemId, 10), exempt, callback);
  },

  clearModifiedIndicator : function(itemId, userId)
  {
    GradebookDWRFacade.clearModifiedIndicator(parseInt(this.getCourseId(), 10), itemId, userId);
  },

  hideColumn : function(itemId)
  {
    GradebookDWRFacade.hideItem(parseInt(this.getCourseId(), 10), itemId, this.hideColumnCallBack.bind(this));
  },

  hideColumnCallBack : function()
  {
    GradebookGridUtil.reloadAndShowInlineReceipt(GradebookUtil.getMessage( 'hideColumnInlineMsg' ));
  },


  updateNumFrozenColumns : function(numFrozenColumns)
  {
    GradebookDWRFacade.updateNumFrozenColumns(parseInt(this.getCourseId(), 10), numFrozenColumns);
  },

  reloadGrid : function()
  {
    theGradeCenter.reloadGrid();
  },

  gotoURL : function(url)
  {
    window.location.href = url;
  },

  clearAttempts : function(colDefId, clearOption, startDate, endDate)
  {
    var frm = document.clearAttemptForm;
    frm.outcomeDefinitionId.value = colDefId;
    frm.clearOption.value = clearOption;
    frm.startDate.value = startDate;
    frm.endDate.value = endDate;
    frm.submit();
  },

  setDefaultView : function(view)
  {
    GradebookDWRFacade.setDefaultView(this.getCourseId(), view, this.setDefaultViewCallback.bind(this));
  },

  setDefaultViewCallback : function()
  {
    var cv = $("currentViewLabel").innerHTML;
    var msg = page.bundle.getString( "setAsDefaultMsg", cv );
    GradebookGridUtil.reloadAndShowInlineReceipt(msg);
  },

  updateUserVisibility : function(userId, visible)
  {
    GradebookDWRFacade.updateUserVisibility(parseInt(this.getCourseId(), 10), userId, visible, this.callbackReceipt.bind(this));
  },

  //data is the number of rows being updated
  //since another admin/instructor could delete a student from a course, we always refresh even though only visibility is changed
  callbackReceipt : function(data)
  {
    this.reloadGrid();
    var oneReceiptPerPage = false;
    // Adding a conditional text is not required as it would never be used as the function updateUserVisibility is
    // always called with visible=false.
    if ( $('receipt_id') )
    {
      oneReceiptPerPage = true;
    }
    new page.InlineConfirmation("success", GradebookUtil.getMessage( 'hideStudentInlineMsg' ), false, oneReceiptPerPage);
  },

  setColumnStudentVisibility : function(callback, columnId, visible)
  {
    GradebookDWRFacade.setColumnStudentVisibility(parseInt(this.getCourseId(), 10), columnId, visible, callback);
  },

  makeExternalGrade : function(itemId)
  {
    GradebookDWRFacade.updatePublicItemId(parseInt(this.getCourseId(), 10), itemId, (this.reloadGrid).bind(this));
  },

  getCourseId : function()
  {
    var crsId = this.courseId;
    if (crsId.indexOf("_") >= 0)
    {
      crsId = crsId.split("_")[1];
    }
    return crsId;
  }

};
  // *********************************************************************
  //************ Gradebook.CellController *******************************
  //*********************************************************************

Gradebook.CellController = Class.create();

Gradebook.CellController.prototype =
{

  /* Controls all user interaction with an HTML table cell and its corresponding grid model cell including:
     cell-type specific context menus
     sorting by clicking on header cell
     selecting a table cell
     editing of cell value, which includes:
     going into edit mode - showing an input text values to be entered
     validating input as typed
     listening for certain keys to submit or cancel editing
     submitting changes to server and showing "Saving indicator"
     check box in first column for selecting students
     rendering of cell value and state indicators
     grade comment & column into popups
   */
  initialize : function(htmlCell, grid, row, column, isHeader, maxNumCol)
  {

    this.htmlCell = $(htmlCell);
    this.htmlCell.id = 'cell_' + row + '_' + column;
    this.htmlCell.controller = this;
    this.grid = grid;
    this.model = grid.model;
    this.row = row;
    this.col = column;
    this.isHeader = isHeader;
    Gradebook.CellController.tableId = this.grid.table.id;
    Gradebook.CellController.currentCell = this;
    var accessibleMode = this.grid.options.accessibleMode;
    this.isTopLeft = (this.row === 0 && this.col === 0) && isHeader;
    if (!accessibleMode)
    {
      this._nonAccessibleInit(maxNumCol);
    }

  },

  _nonAccessibleInit : function(maxNumCol)
  {
    // get elements in cell
    this.viewDiv = GradebookUtil.getChildElementByClassName(this.htmlCell, 'div', 'gbView');
    this.editDiv = GradebookUtil.getChildElementByClassName(this.htmlCell, 'div', 'gbEdit');
    this.editInput = GradebookUtil.getChildElementByClassName(this.htmlCell, 'input', 'editInput');
    this.textDiv = GradebookUtil.getChildElementByClassName(this.htmlCell, 'div', 'gbText');
    this.tabletLabel = GradebookUtil.getChildElementByClassName(this.htmlCell, 'div', 'tabletLabel');
    this.dataDiv = GradebookUtil.getChildElementByClassName(this.htmlCell, 'div', 'gbData');
    this.titleAnchor = GradebookUtil.getChildElementByClassName(this.htmlCell, 'a', 'titleAnchor');
    this.contextMenuAnchor = GradebookUtil.getChildElementByClassName(this.htmlCell, 'a', 'cmimg');
    this.checkInput = GradebookUtil.getChildElementByClassName(this.htmlCell, 'input', 'checkInput');

    if (this.isTopLeft)
    {
      Event.observe(this.checkInput, 'click', this.toggleSelection.bindAsEventListener(this));
      theGradeCenter.grid.checkAllCellController = this;
      return;
    }
    // add listeners to cell & anchors
    Event.observe(this.htmlCell, 'mouseover', this.onMouseOver.bindAsEventListener(this));
    Event.observe(this.htmlCell, 'mouseout', this.onMouseOut.bindAsEventListener(this));

    // add listeners to cell elements
    if (this.contextMenuAnchor)
    {
      var r = ( this.isHeader ) ? "h" : this.row;
      this.contextMenuAnchor.id = "cmlink_" + r + this.col;
      Event.observe( this.contextMenuAnchor, 'focus', this.insertContextMenu.bindAsEventListener( this, this.contextMenuAnchor ) );
      Event.observe( this.contextMenuAnchor, 'click', this.insertContextMenu());
    }

    if (this.row === 0 && this.col !== 0 && this.textDiv && this.dataDiv)
    {
      this.getGridCell = this.getHeaderGridCell;
      Event.observe(this.textDiv, 'click', this.onHeaderClicked.bindAsEventListener(this));
      Event.observe(this.dataDiv, 'focus', this.showHeaderInfoInTaskbar.bindAsEventListener(this));
      Event.observe(this.dataDiv, 'mouseover', this.showHeaderInfoInTaskbar.bindAsEventListener(this));
      Event.observe(this.dataDiv, 'mouseout', this.onHeaderMouseOut.bindAsEventListener(this));
      this.htmlCell.style.cursor = 'pointer';
      // we wire some listeners so that TAB shifts the content in the table
      if (this.contextMenuAnchor && (maxNumCol - 1) == this.col)
      {
        Event.observe(this.contextMenuAnchor, 'keydown', this.shiftOneColOnTAB.bindAsEventListener(this, false));
        this.observeAnchorTab = true;
      }
      if (this.grid.options.numFrozenColumns == (this.col - 1))
      {
        Event.observe(this.dataDiv, 'keydown', this.shiftOneColOnTAB.bindAsEventListener(this, true /* reverse */));
      }
    }
    else
    {
      this.getGridCell = this.getGradeGridCell;
      if (this.editInput)
      {
        Event.observe(this.editInput, 'keydown', this.onInputKeyDown.bindAsEventListener(this));
        Event.observe(this.editInput, 'keyup', this.onInputKeyUp.bindAsEventListener(this));
      }
      if (this.checkInput)
      {
        Event.observe(this.checkInput, 'click', this.onCheckBoxClicked.bindAsEventListener(this));
      }
      else
      {
        Event.observe(this.htmlCell, 'click', this.onClicked.bindAsEventListener(this));
      }
      if (this.titleAnchor)
      {
        Event.observe(this.titleAnchor, 'focus', this.onFocus.bindAsEventListener(this));
      }
    }
  },

  _accessibleInit : function()
  {
    if (this.isInitialized)
    {
      return;
    }
    this.isInitialized = true;
    // get elements in cell
    this.checkInput = this.htmlCell.down('input');
    this.titleAnchor = this.htmlCell.down('a');
    this.contextMenuAnchor = (this.titleAnchor) ? this.titleAnchor : this.htmlCell;

    if (this.isTopLeft)
    {
      Event.observe(this.checkInput, 'click', this.toggleSelection.bindAsEventListener(this));
      theGradeCenter.grid.checkAllCellController = this;
      return;
    }

    if (this.row === 0 && this.col !== 0)
    {
      this.dataDiv = this.titleAnchor;
      this.getGridCell = this.getHeaderGridCell;
      Event.observe(this.htmlCell, 'mouseover', this.showHeaderInfoInTaskbar.bindAsEventListener(this));
      Event.observe(this.htmlCell, 'mouseout', this.onHeaderMouseOut.bindAsEventListener(this));
    }
    else
    {
      this.getGridCell = this.getGradeGridCell;
    }

    if (this.checkInput)
    {
      Event.observe(this.checkInput, 'click', this.onCheckBoxClicked.bindAsEventListener(this));
    }
    else if (this.getGridCell().hasContextMenuInfo(this))
    {
      var r = (this.isHeader) ? "h" : this.row;
      this.contextMenuAnchor.id = "cmlink_" + r + this.col;
      Event.observe( this.contextMenuAnchor, 'focus', this.insertAccessibleContextMenu.bindAsEventListener( this ) );
      Event.observe( this.contextMenuAnchor, 'mouseover', this.insertAccessibleContextMenu.bindAsEventListener( this ) );
    }
    else
    {
      this.titleAnchor.addClassName("noMenu");
    }
    if (this.titleAnchor)
    {
      Event.observe(this.titleAnchor, 'focus', this.onFocus.bindAsEventListener(this));
    }
  },

  isHeaderCell: function()
  {
    return this.isHeader;
  },

  unload: function()
  {
    this.grid = null;
    this.htmlCell.controller = null;
    this.htmlCell = null;
    this.grid = null;
    this.viewDiv = null;
    this.editDiv = null;
    this.editInput = null;
    this.textDiv = null;
    this.dataDiv = null;
    this.titleAnchor = null;
    this.contextMenuAnchor = null;
    this.checkInput = null;
    this.getGridCell = null;
    this.editGridCell = null;
  },

  getUserId : function()
  {
    return this.getGridCell().getUserId();
  },

  getColDefId : function()
  {
    return this.getGridCell().colDef.id;
  },

  //************ checkbox logic *******************************

  onCheckBoxClicked : function(evt)
  {
    var gridcell = this.getGridCell();
    gridcell.setRowChecked(this.checkInput.checked);
    var userId = gridcell.userId;
    if (this.checkInput.checked)
    {
      if (evt.shiftKey && Gradebook.CellController.prototype.lastCheckedUserId)
      {
        this.model.checkedRangeOfStudents(gridcell.userId, Gradebook.CellController.prototype.lastCheckedUserId);
      }
      Gradebook.CellController.prototype.lastCheckedUserId = gridcell.userId;
    }
    else
    {
      Gradebook.CellController.prototype.lastCheckedUserId = null;
    }
    // don't invoke Event.stop here because that in turn calls preventDefault, which prevents the checkbox from toggling
    evt.stopPropagation();
    evt.stopped = true;
  },

  toggleSelection : function()
  {
    if (this.checkInput.checked)
    {
      this.onSelectAllStudents();
    }
    else
    {
      this.onSelectNoStudents();
    }
  },

  onSelectAllStudents : function(evt)
  {
    this.model.checkedAllStudents();
  },

  onSelectNoStudents : function(evt)
  {
    this.model.checkedNoStudents();
  },

  onSelectInvertStudents : function(evt)
  {
    this.model.invertCheckedStudents();
  },

  onSortCheckedStudents : function(evt)
  {
    // always show checked students at top
    this.grid.sortColumn(this, 'DESC');
  },


  //************ sort logic *******************************

  onHeaderClicked: function(evt)
  {
    /*
    * AS-152336 sorting causes incorrect values because edited cell was not
    * released before the sort operation.  Sorting would change the locations
    * of cells except for the one still pinned by the edit state.  unselectCurrentCell
    * can save edit and argument doNotClearStatusBar is true to display status for
    * the column header that was clicked.
    */
    this.unselectCurrentCell(true);

    this.grid.sortColumn(this);
  },

  setSortImage: function(dir)
  {
    this.htmlCell.removeClassName('sortedUp');
    this.htmlCell.removeClassName('sortedDown');
    if ( dir == 'ASC' )
    {
      this.htmlCell.addClassName('sortedUp');
    }
    else if ( dir == 'DESC' )
    {
      this.htmlCell.addClassName('sortedDown');
    }
  },

  onSortAscending: function()
  {
    this.unselectCurrentCell(true);  //AS-152336 see above
    this.grid.sortColumn(this,'ASC');
  },

  onSortDescending: function()
  {
    this.unselectCurrentCell(true);  //AS-152336 see above
    this.grid.sortColumn(this,'DESC');
  },

  //************ select cell logic *******************************

  onFocus: function( evt )
  {
    document.ignoreOnClick = true; //IE7 issue where focus is followed by on click on the document - AS-123689
    window.setTimeout( "document.ignoreOnClick = false", 2000 );
    this.showHeaderInfoInTaskbar();
    this.onClicked( evt );
  },

  onClicked: function(evt)
  {
    if ( this.gridCell && this.gridCell.isAnonymous() )
    {
      return;
    }

    var eventTarget = evt.target ? evt.target : evt.srcElement;
    if ($(eventTarget).hasClassName('cmimg') || $(eventTarget.parentNode).hasClassName('cmimg'))
    {
      if (evt)
      {
        Event.stop( evt );
      }
      return;
    }
    Gradebook.CellController.prototype.lastEventTarget = eventTarget;
    this.selectCell( eventTarget );
    if (evt)
    {
      Event.stop( evt );
    }
  },

  isSelected: function()
  {
    return (Gradebook.CellController.currentSelectedCell == this.htmlCell);
  },

  selectCell: function( optionalEventTarget )
  {
    Gradebook.CellController.prototype.tableHasFocus = true;
    if ( this.isSelected() || this.checkInput )
    {
      return;
    }
    this.closePopups();
    this.unselectCurrentCell( true /*do not clear status bar */ );
    var gridCell = this.getGridCell();
    Gradebook.CellController.currentSelectedCell = this.htmlCell;
    var hascm = this.hasContextMenu();
    Element.addClassName(this.htmlCell, hascm?"cellClick":"cellClickNoCM");
    Element.addClassName(this.htmlCell.parentNode, "focusRowHigh");
    var headerTable = $(Gradebook.CellController.tableId + '_header');
    if (headerTable)
    {
      Element.addClassName(headerTable.rows[0].cells[this.col],"focusHeader");
    }
    if (!this.isEditing && this.titleAnchor)
    {
      // no need to put focus on the anchor if it is already the active element
      if ( !optionalEventTarget || ( optionalEventTarget != this.titleAnchor ) )
      {
        this.titleAnchor.focus();
      }
    }
    else if ( this.grid.options.accessibleMode )
    {
        this.htmlCell.focus();
    }
    this.setTaskbarInfo(gridCell);
    //For anonymous item cell set the focus and allow keyboard navigation.
    //Do not edit the cell.
    if ( this.gridCell && this.gridCell.isAnonymous() )
    {
      return;
    }
    if ( !this.grid.options.accessibleMode )
    {
      this.startEdit();
    }
  },

  showHeaderInfoInTaskbar: function()
  {
    var colDef = this.getGridCell().getColumnDefinition();
    if ( colDef.getType() == "student" )
    {
      theGradeCenter.setMsgInTaskBar( colDef.getName() );
    }
    else
    {
      theGradeCenter.setHeaderInfoInTaskBar( colDef );
    }
  },

  setTaskbarInfo : function(gridCell)
  {
    if (!gridCell)
    {
      theGradeCenter.clearTaskBar();
    }
    else if (gridCell.isGrade())
    {
      var colDef = gridCell.colDef;
      var gradeType = '&nbsp;';
      var pointsPossible = '&nbsp;';
      var primaryDisplay = '&nbsp;';
      var visibileToStudents = '&nbsp;';
      var numAttempts = '&nbsp;';

      try
      {
        if (gridCell.canEdit())
        {
          gradeType = GradebookUtil.getMessage((gridCell.scoreEntryDesignationIsOverride()) ? 'overrideGradeMsg' : 'gradeMsg');
        }
        else
        {
          gradeType = GradebookUtil.getMessage(colDef.getType() + 'Msg');
        }
        primaryDisplay = colDef.primarySchema.name;
        pointsPossible = parent.NumberFormatter.formatPointsTruncate( parseFloat( gridCell.getPointsPossible() ) );
        visibileToStudents = GradebookUtil.getMessage((colDef.vis) ? 'isMsg' : 'isNotMsg');
        var totalStudentsOrGroups = colDef.groupActivity ? colDef.nga : colDef.model.rows.length;
        numAttempts = colDef.numUniqueAttempts + " / " + totalStudentsOrGroups;

      }
      catch (ignore)
      {
      }

      if(colDef)
      {
        theGradeCenter.setTaskBar(gradeType, pointsPossible, primaryDisplay, visibileToStudents, numAttempts, colDef.groupActivity);
      }

    }
    else
    {
      theGradeCenter.setTaskBar();
    }
  },

  unselectCell: function( doNotClearStatusBar )
  {
    Element.removeClassName(this.htmlCell, "cellClick");
    Element.removeClassName(this.htmlCell, "cellClickNoCM");
    Element.removeClassName(this.htmlCell.parentNode, "focusRowHigh");
    var headerTable = $(Gradebook.CellController.tableId + '_header');
    if (headerTable)
    {
      Element.removeClassName(headerTable.rows[0].cells[this.htmlCell.cellIndex],"focusHeader");
    }
    if ( !doNotClearStatusBar )
    {
      this.setTaskbarInfo();
    }
  },

  unselectCurrentCell: function( doNotClearStatusBar )
  {
    var cell = Gradebook.CellController.currentSelectedCell;
    if (cell)
    {
      var done = false;
      var commit = false;
      var cellController = cell.controller;
      if ( cellController)
      {
        if ( cellController.hasUncommittedChanges())
        {
          var validationError = cellController.editGridCell.validate(cellController.editInput.value);
          if (!validationError)
          {
            commit = confirm(GradebookUtil.getMessage('uncommitedchangeErrorMsg'));
          }
          else
          {
            alert(GradebookUtil.getMessage('uncommitedchangeNotSavedErrorMsg'));
          }
        }
        done = cellController.stopEdit(commit, true /* no focus on the cell we are exiting */);
        if(done)
        {
          cellController.unselectCell( doNotClearStatusBar );
        }
      }
      if(done)
      {
      Gradebook.CellController.currentSelectedCell = null;
      }
      return done;
    }
    return true;
  },

  //************ edit grade logic *******************************

  startEdit: function()
  {
    try
    {
      this.editGridCell = this.getGridCell();
      if (!this.editGridCell.canEdit()  ||
           this.editGridCell.isExempt() /* one must clear the exemption before to be able to input a grade */ ||
           !this.isSelected() || !this.editInput )
      {
        return;
      }
      this.isEditing = true;
      this.editInput.value = this.editGridCell.getEditValue();
      if (!window.matchMedia("(max-width: 1024px)").matches) {
          this.viewDiv.style.display = "none";
      }
      this.editDiv.style.display = "block";

      if ( this.editGridCell.scoreEntryDesignationIsOverride() )
      {
        this.editInput.classList.add("override");
      }
      else
      {
        this.editInput.classList.remove("override");
      }

      this.editInput.focus();
      this.editInput.select();
    }
    catch ( ignore ) { }
  },

  onInputKeyDown: function(evt)
  {
    if ( evt && evt.keyCode == Event.KEY_TAB )
    {
        this.stopEdit(true, false); //commit, Set Focus back to cell content
        Event.stop( evt );
    }
  },

  onInputKeyUp: function(evt)
  {
    Event.stop( evt );
    switch (evt.keyCode)
    {
      case (Event.KEY_UP):
      case (Event.KEY_DOWN):
      case (Event.KEY_LEFT):
      case (Event.KEY_RIGHT):
        evt.cancelBubble = false; // allow event to bubble so attempted navigation will occur
        break;
      case (Event.KEY_RETURN):
         try
         {
           Gradebook.noResize = true; /*IEHack*/
           var editDone = this.stopEdit(true /*commit*/, false /*keep focus on cell we exit*/, true /* - while Needs Grading are considered change */);
           if ( editDone )
           {
             // select cell below
             this.grid.selectRelativeCell(1, 0);
           }
         }
         finally
         {
           Gradebook.noResize = false;
         }
        break;
      case (Event.KEY_ESC):
        this.stopEdit(false); // don't commit
        break;
      default:
        var validationError = this.editGridCell.validate( this.editInput.value, true ); // match partial
        if (validationError)
        {
          this.showValidationError(validationError);
        }
        else
        {
          this.hideValidationError();
        }
    }
  },

  shiftOneColOnTAB: function( evt, reverse )
  {
    if ( Event.KEY_TAB != evt.keyCode )
    {
      return;
    }
    if ( evt.shiftKey && reverse)
    {
      if ( this.grid.viewPort.scrollCols( -1 ) )
      {
        if (evt)
        {
          Event.stop( evt );
        }
        this.dataDiv.focus();
      }
    }
    else if ( !evt.shiftKey && !reverse )
    {
      if ( this.grid.viewPort.scrollCols( 1 ) )
      {
        if (evt)
        {
          Event.stop( evt );
        }
        this.dataDiv.focus();
      }
    }
  },

  // returns false if validation error occurs when committing
  stopEdit: function(commit, doNotSetFocus, doNotIgnoreDash)
  {
    if (!this.isEditing)
    {
      return true;
    }
    var currentCell = this.editGridCell;
    // if the user press Return and the grade is a -, and it was a - before but obfuscated by a status indicator
    // then trigger the null mechanism; - is only accounted for Return, not when cell loses focus due to other reasons
    if (commit &&
        ( this.hasUncommittedChanges() ||
            ( doNotIgnoreDash && ( currentCell.needsGrading() || currentCell.attemptInProgress() ) ) ) )
    {
      this.editInput.value = gradebook_utils.trimString( this.editInput.value );
      var inputVal = this.editInput.value;
      var validationError = currentCell.validate( inputVal );
      if (validationError)
      {
        this.showValidationError(validationError);
        this.editInput.select();
        this.editInput.focus();
        return false;
      }
      var save = true;
      if ( !inputVal )
      {
        inputVal = '-';
      }
      // confirm if OK to delete or null grade
      if (inputVal == '-')
      {
        if ( currentCell.getValue() == '-' && !currentCell.hasAttempts() )
        {
          save = false;
        }
        else
        {
          if ( currentCell.isOverride() )
          {
            if ( !currentCell.hasAttempts() )
            {
              save = confirm( GradebookUtil.getMessage( 'confirmRevertMsg' ) );
            }
            else
            {
              this.showRevertWithAttemptsConfirmation( doNotSetFocus );
              return false;
            }
          }
          else if ( currentCell.hasMultipleAttempts() )
          {
            this.showMultipleAttemptsNullConfirmation( doNotSetFocus );
            return false;
          }
          else
          {
            if ( !this.editGridCell.colDef.isAttemptWithPayload( ) )
            {
              // There is no data behind that attempt, so not an issue if it is deleted
              save = confirm(GradebookUtil.getMessage( 'confirmNullMsg' ));
            }
            else
            {
              // here this a real attempt, so we need to prompt the user what do with it, delete or revert to needs grading?
              this.showSingleAttemptNullConfirmation( doNotSetFocus );
              return false;
            }
          }
        }
      }
      if (save)
      {
        // send update to server
        this.editGridCell.update(inputVal);

        // morph on timestamp on grade information bar
        this.afterSavingItem();
      }
    }
    this.returnCellToNotEdit( doNotSetFocus );
    return true;
  },

  returnCellToNotEdit: function( doNotSetFocus )
  {
    this.hideValidationError();
    this.isEditing = false;
    this.editGridCell = null;
    this.editInput.classList.remove("override");
    this.viewDiv.style.display = "block";
    if (!doNotSetFocus)
    {
      this.titleAnchor.focus();
    }
    this.editDiv.style.display = "none";
  },

  showRevertWithAttemptsConfirmation : function(doNotSetFocus)
  {
    var revertToNeedsGradingEl = $('revertAndNeedsGradingEl');
    if ( !this.editGridCell.colDef.isAttemptWithPayload() || !this.editGridCell.colDef.isAllowAttemptGrading() )
    {
      // Manual Columns/Activity do not have attempt data, so it does not make sense to transition to needs grading
      // Columns that do not allow attempt grading cannot allow to change an attempt grade to needs grading
      revertToNeedsGradingEl.hide();
      $('revertAndNeedsGrading').name = 'xxxxxx'; // fix KB navigation using arrows
                                                  // to move up/down the choices
    }
    else
    {
      revertToNeedsGradingEl.show();
      $('revertAndNeedsGrading').name = 'revertWithAttemptChoice';
    }
    var firstRadio = $('revertOnly');
    firstRadio.checked = true;
    GradebookGridUtil.showAlertLightbox( 'revertWithAttemptsConfirm', window.gridMessages.confirmRevertLBTitle, firstRadio );
    Gradebook.CellController.currentCell = this;
    $('revertWithAttemptsConfirmCancel').onclick = function()
    {
      Gradebook.CellController.currentCell.closeAlertLightbox(doNotSetFocus);
      return false;
    };
    doubleSubmit.registerFormSubmitEvents( $('revertWithAttemptsConfirmForm'), function(){
      try
      {
        if ($('revertOnly').checked)
        {
          Gradebook.CellController.currentCell.editGridCell.update('-');
        }
        else if ($('revertAndNeedsGrading').checked)
        {
          Gradebook.CellController.currentCell.editGridCell.clearAll(false);
        }
        else if ($('revertAndDelete').checked)
        {
          if (confirm(window.gridMessages.confirmDeleteOnRevert))
          {
          Gradebook.CellController.currentCell.editGridCell.clearAll(true);
          }
        }
        // morph on timestamp on grade information bar
        Gradebook.CellController.currentCell.afterSavingItem();
      }
      catch( e )
      {
        // we must always return false to prevent the form to ever submit
        alert( e );
      }
      Gradebook.CellController.currentCell.closeAlertLightbox(doNotSetFocus);
      return false;
    });
  },

  showMultipleAttemptsNullConfirmation: function( doNotSetFocus )
  {
    var allowToNeedsGrading  = !this.editGridCell.colDef.isManual() && this.editGridCell.colDef.isAllowAttemptGrading();
    if ( !allowToNeedsGrading )
    {
      // the only option in that case is to delete the attempts
      $('multipleAttemptsModeSelection').hide( );
      $('multipleAttemptsConfirmDeletion').show( );
    }
    else
    {
      $('multipleAttemptsConfirmDeletion').hide( );
      $('multipleAttemptsModeSelection').show( );
    }
    var templateForAttemptEl = $('attemptChoicesTemplate');
    if ( !templateForAttemptEl )
    {
      alert( 'could not find template' );
    }
    templateForAttemptEl.hide();
    var templateForAttempt = templateForAttemptEl.down('ol').innerHTML;
    var attemptsContainer = $('attemptChoices').down('ol');
    attemptsContainer.innerHTML = '';
    attemptsContainer.forGrade = this.editGridCell.getKey();
    this.editGridCell.loadAttemptsInfo( function( cell )
    {
      // 1st since this is asynchronous let's make sure the displayed
      // lightbox is still for the grade we just got the attempts for
      if ( cell.getKey() != attemptsContainer.forGrade )
      {
        return;
      }
      var innerHtml = '';
      cell.data.attemptsInfo.each( function( attemptInfo ) {
        var checkboxHtml = templateForAttempt;
        checkboxHtml = checkboxHtml.replace( 'ATTEMPT_ID', attemptInfo.id );
        checkboxHtml = checkboxHtml.replace( 'ATTEMPT_ID_NAME', attemptInfo.getText() );
        checkboxHtml = checkboxHtml.replace( /attemptsToClearTEMPLATE/g, 'attemptsToClear' );
        checkboxHtml = checkboxHtml.replace( /attemptsToClearIDTEMPLATE/g, 'att_' + attemptInfo.id );
        innerHtml += checkboxHtml;
      } );
      attemptsContainer.innerHTML = innerHtml;
      GradebookGridUtil.resizeLightbox( 'multipleAttemptsNullGradeConfirm' );
    } );
    $('multipleAttemptsAll').checked=true;
    var synCheckboxesDisabledState = function()
    {
      var disabled = !$('multipleAttemptsSelected').checked;
      var attemptsCB = $('multipleAttemptsNullGradeConfirmForm').getInputs( 'checkbox', 'attemptsToClear' );
      attemptsCB.each( function( cb ) { cb.disabled = disabled; } );
    };
    $('multipleAttemptsAll').onclick = synCheckboxesDisabledState;
    $('multipleAttemptsSelected').onclick = synCheckboxesDisabledState;
    var submitButton = $('multipleAttemptsNullGradeConfirmSubmit');
    var firstElement = allowToNeedsGrading?$('multipleAttemptsNeedsGrading'):$('multipleAttemptsDeleteCB');
    firstElement.checked = allowToNeedsGrading;
    GradebookGridUtil.showAlertLightbox( 'multipleAttemptsNullGradeConfirm', window.gridMessages.confirmRevertLBTitle, firstElement );
    Gradebook.CellController.currentCell = this;
    $('multipleAttemptsNullGradeConfirmCancel').onclick = function()
    {
      Gradebook.CellController.currentCell.closeAlertLightbox( doNotSetFocus );
      return false;
    };
    doubleSubmit.registerFormSubmitEvents( $('multipleAttemptsNullGradeConfirmForm'), function(){
      try
      {
        var isAllAttempt, attemptIds;
        var form = $('multipleAttemptsNullGradeConfirmForm');
        if ( $('multipleAttemptsSelected').checked )
        {
          attemptIds = [];
          var attemptsCB = form.getInputs( 'checkbox', 'attemptsToClear' );
          attemptsCB.each( function( cb ) { if ( cb.checked )  {attemptIds.push( cb.value ); } } );
        }
        else
        {
          isAllAttempt = (  $('multipleAttemptsAll').checked );
        }
        if ( allowToNeedsGrading && $( 'multipleAttemptsNeedsGrading').checked )
        {
          if ( isAllAttempt )
          {
          Gradebook.CellController.currentCell.editGridCell.clearAll( false );
          }
          else if ( attemptIds && attemptIds.size() > 0 )
          {
          Gradebook.CellController.currentCell.editGridCell.clearSelected( attemptIds, false );
          }
        }
        else if ( ( allowToNeedsGrading  && $( 'multipleAttemptsDelete').checked     ) ||
                  ( !allowToNeedsGrading && $( 'multipleAttemptsDeleteCB' ).checked  ) )
        {
          if ( isAllAttempt )
          {
            if ( confirm( window.gridMessages.confirmDeleteOnRevert ) )
            {
              Gradebook.CellController.currentCell.editGridCell.clearAll( true );
            }
          }
          else if ( attemptIds && attemptIds.size() > 0 )
          {
            if ( confirm( window.gridMessages.confirmDeleteSelected ) )
            {
              Gradebook.CellController.currentCell.editGridCell.clearSelected( attemptIds, true );
            }
          }
        }
      }
      catch ( e )
      {
        // we must always return false to prevent the form to ever submit
        alert( e );
      }
      Gradebook.CellController.currentCell.closeAlertLightbox( doNotSetFocus );
      return false;
    });
  },

  showSingleAttemptNullConfirmation: function( doNotSetFocus )
  {
    var allowToNeedsGrading = this.editGridCell.colDef.isAllowAttemptGrading();
    var flyoutFormId = allowToNeedsGrading?'singleAttemptNullGradeConfirm':'singleAttemptDeleteConfirm';
    var firstElement = allowToNeedsGrading?$('singleAttemptNeedsGrading'):$('singleAttemptDeleteCB');
    firstElement.checked = allowToNeedsGrading;
    GradebookGridUtil.showAlertLightbox( flyoutFormId, window.gridMessages[ allowToNeedsGrading?'confirmSingleAttemptLB':'confirmDeleteSingleAttemptLB' ], firstElement );
    Gradebook.CellController.currentCell = this;
    $( flyoutFormId + 'Cancel').onclick = function()
    {
      Gradebook.CellController.currentCell.closeAlertLightbox( doNotSetFocus );
      return false;
    };
    doubleSubmit.registerFormSubmitEvents( $( flyoutFormId + 'Form'), function(){
      try
      {
        if ( allowToNeedsGrading )
        {
          if ( $('singleAttemptNeedsGrading').checked)
          {
          Gradebook.CellController.currentCell.editGridCell.clearAll(false);
          Gradebook.CellController.currentCell.afterSavingItem();
          }
          else if ( ( $('singleAttemptDelete').checked ) )
          {
            if (confirm(window.gridMessages.confirmDeleteOnRevert))
            {
              Gradebook.CellController.currentCell.editGridCell.clearAll(true);
              Gradebook.CellController.currentCell.afterSavingItem();
            }
          }
        }
        else if ( $('singleAttemptDeleteCB').checked )
        {
          if (confirm(window.gridMessages.confirmDeleteOnRevert))
          {
          Gradebook.CellController.currentCell.editGridCell.clearAll(true);
          Gradebook.CellController.currentCell.afterSavingItem();
          }
        }
      }
      catch( e )
      {
        // we must always return false to prevent the form to ever submit
        alert( e );
      }
      Gradebook.CellController.currentCell.closeAlertLightbox(this.doNotSetFocus);
      return false;
    });
  },

  closeAlertLightbox: function( doNotSetFocus )
  {
    this.returnCellToNotEdit( doNotSetFocus );
    this.grid.selectRelativeCell(1, 0);
    Gradebook.alertLightbox.close();
    Gradebook.alertLightbox = null;
  },

  hasUncommittedChanges: function(evt)
  {
    if( this.isEditing )
    {
      if( !this.editGridCell.isGraded() && this.editGridCell.needsGrading() )
      {
        return this.editInput.value !== ""; //if the cell is 'needs grading' and doesn't have any graded attempt, we must make sure the editted input is not empty. otherwise, it means the user just clicked on a needs grading cell and then moved away so no action needs to be taken
      }
      else
      {
        return this.editInput.value != this.editGridCell.getEditValue();
      }
    }
    return false;
  },

  //************ rendering logic *******************************

  previousElementSibling: function(node)
  {
    node = node.previousSibling;
    while ( node  )
    {
      if (node.nodeType == 1)
      {
        return node;
      }
      node = node.previousSibling;
    }
    return null;
  },

  renderHTML : function(dataCell)
  {
    var anchorVal;
    var altVal;
    if (!this.gridCell)
    {
      this.gridCell = new window.Gradebook.GridCell();
      if (!this.grid.options.accessibleMode && this.col == 1)
      {
        // checkbox column shares grid controller with first cell, this allows
        // access
        // to metadata for select row functionality
        this.previousElementSibling(this.htmlCell).controller.gridCell = this.gridCell;
      }
    }
    var gridCell = this.gridCell;
    gridCell.setData(dataCell);
    var cellValue = gridCell.getCellValue();

    if (this.grid.options.accessibleMode)
    {
      this._accessibleInit();
    }
    this.htmlCell.className = this.grid.model.getColorScheme( gridCell );

    if (gridCell.isGrade() && !this.grid.model.userCanViewGradebookGrades)
    {
      anchorVal = window.gridImages.noGrade;
      altVal = gridCell.getAltValue();
    }
    else if ( gridCell.isAnonymous() )
    {
      anchorVal = window.gridImages.anonymousGrade;
      altVal = window.gridMessages.anonymousGradeMsg;
    }
    else if( gridCell.isExcluded() )
    {
      anchorVal = window.gridImages.excludedGrade;
    }
    else if (gridCell.isExempt())
    {
      anchorVal = window.gridImages.exemptGrade;
      altVal = gridCell.getAltValue();
    }
    else if ( gridCell.isOverride() )
    {
      anchorVal = cellValue;
      altVal =  gridCell.getAltValue();
      if ( gridCell.needsGrading() && gridCell.isOverrideBeforeNeedsGrading( ) )
      {
        anchorVal = anchorVal + '&nbsp;'+ window.gridImages.needsGrading;
      }
    }
    else if ( gridCell.needsGrading() && gridCell.canGrade() )  // only show needs grading icon if grader can grade (delegated grader)
    {
      anchorVal = window.gridImages.needsGrading;
      if ( gridCell.isGraded() )
      {
       anchorVal = anchorVal+ '&nbsp;'+ cellValue;
      }
      altVal = gridCell.getAltValue();
    }
    else if ( gridCell.needsReconcile() )
    {
      anchorVal = window.gridImages.needsReconcile;
      if ( gridCell.isGraded() )
      {
       anchorVal = anchorVal+ '&nbsp;'+ cellValue;
      }
      altVal = gridCell.getAltValue();
    }
    else if ( gridCell.attemptInProgress() )
    {
      anchorVal = window.gridImages.attemptInProgress;
      if ( gridCell.isGraded() )
      {
       anchorVal = anchorVal+ '&nbsp;'+ cellValue;
      }
    }
    else if (gridCell.isComplete())
    {
      anchorVal = cellValue;
      altVal = GradebookUtil.getMessage('completedMsg');
    }
    else if ( gridCell.isGrade() && !gridCell.isGraded())
    {
      anchorVal = window.gridImages.noGrade;
      altVal = gridCell.getAltValue();
    }
    else
    {
      anchorVal = cellValue;
      altVal = gridCell.getAltValue();
    }
    if ( anchorVal !== null )
    {
      if (this.col == 1 && !gridCell.isAvailable())
      {
        anchorVal = window.gridImages.studentUnavailable + " " + anchorVal;
      }
      if (gridCell.isOverride() )
      {
        anchorVal = window.gridImages.gradeOverride + " " + anchorVal;
      }
      if (anchorVal.blank && anchorVal.blank())
      {
        anchorVal = '&nbsp;';
      }
      if (this.titleAnchor)
      {

        var tabletLabelText = dataCell.colDef.name;
        if (this.tabletLabel) {
          this.tabletLabel.innerHTML = tabletLabelText + ": ";
        }
        this.titleAnchor.innerHTML = anchorVal;
        this.titleAnchor.title = altVal;
      }
      //mouseOver function for mobile and tablets since there is no mouseover/hover
      if (window.matchMedia("(max-width: 1024px)").matches) {
          this.onMouseOver();
      }
    }
  },

  renderHeaderCellHTML: function( colDef )
  {
    if (this.grid.options.accessibleMode)
    {
      this._accessibleInit();
    }
    var anchorVal = '';
    var title = colDef.name;
    // IE hack so that unicode are properly escaped
    this.dataDiv.innerHTML = title;
    this.dataDiv.title = title;
    if (!colDef.isVisibleToStudents())
    {
      anchorVal += window.gridImages.itemNotVisible;
    }
    if (colDef.isPublic())
    {
      anchorVal += window.gridImages.externalGrade;
    }
    if (colDef.hasError())
    {
      anchorVal += window.gridImages.gradingError;
    }
    anchorVal += title;
    this.dataDiv.innerHTML = anchorVal;
  },

  afterSavingItem: function()
  {
    var timeStampDiv = $("timeStampDiv");
    var flashingColor = "color:#000;background:#fff";
    var backgroundColor = "color: #000; background: #FFCC66";
    if ( timeStampDiv )
    {
      timeStampDiv.morph( backgroundColor );
      setTimeout("$('timeStampDiv').morph('"+flashingColor+"')", 1000);
    }
  },

  showValidationError: function(error)
  {
    var errDiv = $("errorDiv");
    var p = errDiv.down('p.errorDiv2');
    p.innerHTML = error;
    errDiv.style.display = "block";
    var pos = GradebookUtil._toAbsolute(this.htmlCell, false, errDiv.offsetParent );
    errDiv.style.top = pos.y + this.htmlCell.offsetHeight + "px";
    errDiv.style.left = pos.x -1 + "px";
    Element.addClassName(this.htmlCell, "cellError");
  },

  hideValidationError: function()
  {
    var errDiv = $("errorDiv");
    errDiv.style.display = "none";
    Element.removeClassName(this.htmlCell, "cellError");
  },

  hasContextMenu: function()
  {
    if ( this.col === 0 )
    {
      return false;
    }
    else
    {
      return (this.getGridCell().hasContextMenuInfo(this) );
    }
  },

  onMouseOver: function(evt)
  {
    if (!this.htmlCell || this.htmlCell.className == "cellClick")
    {
      return;
    }
    var hascm = this.hasContextMenu();
    Element.addClassName(this.htmlCell, hascm?"cellhigh":"cellhighNoCM");
    var rowElement = this.htmlCell.parentNode;
    if (rowElement.className != "focusRowHigh")
    {
      Element.addClassName(rowElement, "rowhigh");
    }
  },

  onMouseOut: function(evt)
  {
    if (!this.htmlCell || this.htmlCell.className == "cellClick")
    {
      return;
    }
    Element.removeClassName(this.htmlCell, "cellhigh");
    Element.removeClassName(this.htmlCell, "cellhighNoCM");
    var rowElement = this.htmlCell.parentNode;
    if (rowElement.className != "focusRowHigh")
    {
      Element.removeClassName(rowElement, "rowhigh");
    }
  },

  onHeaderMouseOut: function( evt )
  {
    if ( Gradebook.CellController.currentSelectedCell )
    {
      var selectedCell = Gradebook.CellController.currentSelectedCell.controller;
      selectedCell.setTaskbarInfo( selectedCell.getGridCell() );
    }
    else
    {
      theGradeCenter.clearTaskBar();
    }
  },


  //************ context menu logic *******************************

  insertContextMenu: function()
  {
    // Verify if an existing context menu is already available (Stop duplicates from being present)
    if( this.contextMenuController !== undefined )
    {
      return;
    }
    // clone template to create a new context menu
    var cm = theGradeCenter.contextMenuTemplate.cloneNode(true);

    // create & set a new unique id
    var uniqueId = cm.down("a").id.split('_')[1];
    var newId = this.contextMenuAnchor.id.split('_')[1];
    cm.update( cm.innerHTML.gsub(uniqueId, newId) );

    // doNotSetFocusOnClose is used in page.ContextMenu.onCloseLinkClick to determine if focus
    // should be set to the contextMenuAnchor after the menu is closed. In non-accesible mode, we
    // do not want to set focus to the contextMenuAnchor because it is made invisible onMouseOut
    cm.down( 'a.cmimg' ).doNotSetFocusOnClose = !this.grid.options.accessibleMode;

    // create context menu controller
    var cmCtrl = new page.ContextMenu( cm, cm.down("div").id );
    cmCtrl.cellController = this;
    this.contextMenuController = cmCtrl;

    // add context menu to table cell, remove existing link
    var link = this.contextMenuAnchor;
    $(this.htmlCell).down('div').appendChild( cm );
    link.stopObserving();
    link.up('div').remove();
    if (this.observeAnchorTab)
    {
      Event.observe(cmCtrl.displayContextMenuLink, 'keydown', this.shiftOneColOnTAB.bindAsEventListener(this, false));
    }
  },

  insertAccessibleContextMenu: function( event )
  {
    if ( this.htmlCell.hasContextMenu )
    {
      return;
    }
    this.htmlCell.hasContextMenu = true;
    // clone template to create a new context menu
    var cm = theGradeCenter.contextMenuTemplate.cloneNode(true);
    var cma = cm.down("a");
    var link = this.contextMenuAnchor;

    // create & set a new unique id
    var uniqueId = cma.id.split('_')[1];
    var newId = uniqueId + "_" + this.row + "_" + this.col;
    cm.update( cm.innerHTML.gsub(uniqueId, newId) );
    cma.update( link.innerHTML );
    var txt = link.innerHTML;

    // add context menu to table cell
    $(this.htmlCell).appendChild( cm );

    link.stopObserving();
    link.remove();
    cma = cm.down("a");
    cma.className = "";
    cma.update( txt );
    this.titleAnchor = this.htmlCell.down('a');
    this.contextMenuAnchor = (this.titleAnchor) ? this.titleAnchor : this.htmlCell;

    // create context menu controller
    var cmCtrl = new page.ContextMenu( cm, cm.down("div").id );
    Event.observe( this.contextMenuAnchor, 'focus', this.onFocus.bindAsEventListener( this ) );
    cmCtrl.cellController = this;
    this.contextMenuController = cmCtrl;

    if ( event && event.type == "focus" && event.target == link )
    {
      cma.focus();
    }
  },

  getContextMenuItems: function()
  {
    return this.getGridCell().getContextMenuItems( this );
  },

  // ************ comments logic *******************************

  onAddComment: function()
  {
    this.closePopups();
    // here rather than on close to fix a UI glitch 1st time the div is shown
    theGradeCenter.instructorCommentsResize._reset();
    theGradeCenter.studentCommentsResize._reset();
    var pos = GradebookUtil._toAbsolute(this.htmlCell);
    var submitCommentsButton = $("submitCommentsButton");
    if (submitCommentsButton.onclickHandler)
    {
      Event.stopObserving(submitCommentsButton, 'click', submitCommentsButton.onclickHandler);
    }
    submitCommentsButton.onclickHandler = this.onSubmitComments.bindAsEventListener(this);
    Event.observe(submitCommentsButton,'click',submitCommentsButton.onclickHandler);

    var vtbeCommentsButton = $("vtbeCommentsButton");
    if (vtbeCommentsButton.onclickHandler){
      Event.stopObserving(vtbeCommentsButton, 'click', vtbeCommentsButton.onclickHandler);
    }
    vtbeCommentsButton.onclickHandler = this.onVtbeComments.bindAsEventListener(this);
    Event.observe(vtbeCommentsButton,'click',vtbeCommentsButton.onclickHandler);

    var readOnlyStudentComments = $("readOnlyStudentComments");
    if (readOnlyStudentComments.onclickHandler){
      Event.stopObserving(readOnlyStudentComments, 'click', readOnlyStudentComments.onclickHandler);
    }
    readOnlyStudentComments.onclickHandler = this.onVtbeComments.bindAsEventListener(this);
    Event.observe(readOnlyStudentComments,'click',readOnlyStudentComments.onclickHandler);

    var readOnlyInstructorComments = $("readOnlyInstructorComments");
    if (readOnlyInstructorComments.onclickHandler){
      Event.stopObserving(readOnlyInstructorComments, 'click', readOnlyInstructorComments.onclickHandler);
    }
    readOnlyInstructorComments.onclickHandler = this.onVtbeComments.bindAsEventListener(this);
    Event.observe(readOnlyInstructorComments,'click',readOnlyInstructorComments.onclickHandler);

    var commentsDiv = $("commentsDiv");
    page.util.exposeElementForMeasurement( commentsDiv );
    if (commentsDiv.onclickHandler)
    {
      Event.stopObserving(commentsDiv, 'click', commentsDiv.onclickHandler);
    }
    commentsDiv.onclickHandler = this.onClickCommentsDiv.bindAsEventListener(this);
    Event.observe(commentsDiv,'click',commentsDiv.onclickHandler);
    var ie = GradebookUtil.isIE();
    var rightedge = ie ? document.body.clientWidth: window.innerWidth;
    var bottomedge = ie ? document.body.clientHeight: window.innerHeight;
    var offright=false;
    var offbottom=false;
    if( pos.y+commentsDiv.offsetHeight>bottomedge )
    {
      offbottom = true;
    }
    if( pos.y-commentsDiv.offsetHeight<0 )
    {
      offbottom = false;
    }
    if( pos.x+commentsDiv.offsetWidth>rightedge-20 )
    {
      offright = true;
    }
    page.util.unExposeElementForMeasurement( commentsDiv );
    if( offbottom )
    {
      $("commentArrowUp").style.display="none";
      $("commentArrowDown").style.display="block";
      $("commentArrowDown").className="bubArrowBot";
      pos.y=pos.y-commentsDiv.offsetHeight;
    }
    else
    {
      $("commentArrowUp").style.display="block";
      $("commentArrowDown").style.display="none";
      $("commentArrowUp").className="bubArrowTop";
    }
    if ( offright )
    {
      $("commentArrowDown").className="bubArrowBot2";
      $("commentArrowUp").className="bubArrowTop2";
      pos.x=pos.x-200;
    }
    /* adjust position if body is not 100% of viewport ie 2016 theme */
    var basedOff = window.getComputedStyle(document.body).getPropertyValue('--theme-based-off').trim();
    
    if (basedOff === 2012) {
      /* 2012 theme - this box gets fixed position via css */
      commentsDiv.style.left = pos.x + "px";
      commentsDiv.style.top = pos.y + "px";
    } else {
    /* 2016 theme
     * The method used to track the current theme in use is not supported on IE11 as of 07/2018,
     * so if it is unable to grab the basedOff value it defaults to 2016 adjustments as that is the default theme.
     * This may cause an IE11 user with a 2012 based theme to have slightly off center comment boxes, but this does not affect usability. */
      commentsDiv.style.left = pos.x - 150 + "px";
      commentsDiv.style.top = pos.y - 300 + "px";
    }
    commentsDiv.style.display="block";
    if ( GradebookUtil.isFFonMac() )
    {
      GradebookGridUtil.shimDiv( commentsDiv );
    }
    this.model.onAddComment(this.getUserId(), this.getColDefId());
    Gradebook.CellController.commentCell = this.htmlCell;
    // delay focusing on comments text area so it has time to render
    // The commentsDiv contains two Form.Element.Resize controllers for the comments/feedback text areas. (see resize.js)
    // These controllers need a little time to reset when the div is made visible.
    (function() { $( 'studentComments' ).focus();  }.delay( 0.5 ) );
  },

  onVtbeComments: function() {
    // Open a lightbox
    var thisCell = this.getGridCell();
    var userId = thisCell.getUserId();
    var colId = thisCell.colDef.id;
    var courseId = thisCell.colDef.model.courseId;
    var lightboxParam = {
            defaultDimensions: { w:800, h:600 },
            ajax: {url: '/webapps/gradebook/do/instructor/viewQuickComments?course_id='+courseId+'&courseMembershipId=_'+ userId + '_1&outcomeDefinitionId=_' + colId + '_1',
            loadExternalScripts: true,
            asyn : false
            },
            title: GradebookUtil.getMessage('quickcommentVtbeTitle'),
            closeOnBodyClick: false,
            showCloseLink: false,
            contents: '',
            useDefaultDimensionsAsMinimumSize: true
        };
      var quickCommentsLightbox = new lightbox.Lightbox( lightboxParam );
      quickCommentsLightbox.open( );
      this.afterSavingItem();
      this.closeComments();
  },

  onSubmitComments: function()
  {
    var instructorNotes = $("instructorComments");
    var studentComments = $("studentComments");
    if ( !GradebookUtil.validateMaxLength( instructorNotes, GradebookUtil.getMessage( 'instructorNotesMsg' ), 1000 ) )
    {
        return false;
    }
    if ( !GradebookUtil.validateMaxLength( studentComments, GradebookUtil.getMessage( 'feedBackToUserMsg' ), 1000 ) )
    {
        return false;
    }
    this.model.setComments( this.getUserId(), this.getColDefId(), studentComments.value, instructorNotes.value);
    this.afterSavingItem();
    this.closeComments();
  },

  onClickCommentsDiv: function(evt)
  {
    var eventTarget = evt.target ? evt.target : evt.srcElement;
    Gradebook.CellController.prototype.lastCommentsEventTarget = eventTarget;
  },

  testCommentsOpen: function(evt)
  {
    if (!evt)
    {
      return;
    }
    var commentsDiv = $("commentsDiv");
    var ctrl = Gradebook.CellController.prototype;
    var eventTarget = evt.target ? evt.target : evt.srcElement;
    // if editing comments prompt user to save if click outside comments div
    if ( commentsDiv && commentsDiv.getStyle("display") != "none" &&
      ctrl.lastCommentsEventTarget != eventTarget)
    {
      if ( confirm( GradebookUtil.getMessage( 'uncommitedCommentChangeErrorMsg' ) ) )
      {
        $("submitCommentsButton").onclick();
      }
      else {
        ctrl.closeComments();
      }
    }
  },

  closeComments: function()
  {
    // focus the cell
    if (  Gradebook.CellController.commentCell )
    {
      var cell = $( Gradebook.CellController.commentCell.id );
      cell.addClassName( 'cellClick' );
      cell.down( 'a' ).focus();
    }
    var commentsDiv = $("commentsDiv");
    commentsDiv.style.display="none";
    var submitCommentsButton = $("submitCommentsButton");
    if (submitCommentsButton.onclickHandler)
    {
      Event.stopObserving(submitCommentsButton, 'click', submitCommentsButton.onclickHandler);
      submitCommentsButton.onclickHandler = null;
    }
    if (commentsDiv.onclickHandler)
    {
      Event.stopObserving(commentsDiv, 'click', commentsDiv.onclickHandler);
      commentsDiv.onclickHandler = null;
    }
    $("shimDiv").style.display="none";

  },


  //************ miscellaneous *******************************

  closePopups: function(evt)
  {
    $("infodiv").style.display="none";
    $("icondiv_up").style.display="none";
    $("icondiv_down").style.display="none";
    $("shadow").style.display = "none";
    if ( Gradebook.doNotCloseAttemptsForm )
    {
      Gradebook.doNotCloseAttemptsForm = false;
    }
    else
    {
      $("clearAttemptsFlyOut").style.display = "none";
    }
    Gradebook.CellController.prototype.testCommentsOpen(evt);
    $("shimDiv").style.display="none";
  },

  getGradeGridCell: function()
  {
    return this.gridCell;
  },

  getHeaderGridCell: function()
  {
    return this.grid.viewPort.getHeaderGridCell(this.col);
  },

  closePopupsAndRestoreFocus: function(evt)
  {
    var ctrl = Gradebook.CellController.prototype;
    ctrl.closePopups(evt);

    var eventTarget = null;
    if ( evt )
    {
      eventTarget = evt.target ? evt.target : evt.srcElement;
    }

    if (ctrl.lastEventTarget == eventTarget)
    {
      ctrl.tableHasFocus = true;
    }
    else if (ctrl.tableHasFocus)
    {
      ctrl.unselectCurrentCell();
      ctrl.tableHasFocus = false;
    }
  },

  onShowClearAttemptsForm : function()
  {
      var colDef = this.getGridCell().getColumnDefinition();
      var formDiv = $('clearAttemptsFlyOut');
      var offset = Position.cumulativeOffset(this.htmlCell);
      if (this.grid.options.accessibleMode)
      {
        var tableContainer = $('table1_accessible_container');
        offset[0] -= tableContainer.scrollLeft;
        offset[1] -= tableContainer.scrollTop;
      }
      formDiv.setStyle(
      {
        display : "block"
      });
      var width = formDiv.getWidth();
      var bodyWidth = $(document.body).getWidth();
      if (page.util.isRTL())
      {
        offset[0] = offset[0] + Element.getWidth(this.contextMenuAnchor) - width;
        if (offset[0] < 0)
        {
          offset[0] = 0;
        }
      }
      if (offset[0] + width > bodyWidth)
      {
        offset[0] = offset[0] - width + Element.getWidth(this.contextMenuAnchor);
      }
      var ypos = offset[1] + Element.getHeight(this.contextMenuAnchor);
      formDiv.setStyle(
      {
        left : offset[0] + "px",
        top : ypos + "px"
      });

    // restoring default values
    if ( Gradebook.clearAttemptsFormDefault )
    {
      $('selectOption').value = Gradebook.clearAttemptsFormDefault.defaultSelect;
      $('dp_bbDateTimePicker_start_date').value = Gradebook.clearAttemptsFormDefault.defaultStartDate;
      $('dp_bbDateTimePicker_end_date').value = Gradebook.clearAttemptsFormDefault.defaultEndDate;
      $('bbDateTimePickerstart').value = Gradebook.clearAttemptsFormDefault.defaultStartDateHidden;
      $('bbDateTimePickerend').value = Gradebook.clearAttemptsFormDefault.defaultEndDateHidden;
    }
    $('clearAttemptsOptionSelect').checked = true;
    $('clearAttemptsFlyOutSubmit').onclick = this.onSubmitClearAttempts.bindAsEventListener( this ) ;
  },

  onSubmitClearAttempts: function( event )
  {
    if (event)
    {
      Event.stop( event );
    }
    //want to do this check before we give "Are you sure" confirmation msg
    if( !$('clearAttemptsOptionSelect').checked && !calendar.DateTimePicker.validatePickers( event ) )
    {
      return false;
    }
    if ( !confirm( GradebookUtil.getMessage( 'clearAttemptConfirmMsg' ) ) )
    {
      return false;
    }
    if ( $('clearAttemptsOptionSelect').checked )
    {
      // TODO: This is a hack to get around the date validation that is happening automatically on this form for the dates.
      // Ideally the validation in calendar-time.js would be able to be told about a radio button to check before validation too...
      // similar to the checkbox checking that already exists there.  This change feels safer though - to explicitly disable the validation
      // in this one case where I know we don't want it.
      var sdPicker = calendar.DatePicker.getStartDatePicker('bbDateTimePicker');
      var edPicker = calendar.DatePicker.getEndDatePicker('bbDateTimePicker');
      sdPicker.skipValidation = true;
      edPicker.skipValidation = true;
      this.getGridCell().clearAttempts( $('selectOption').value );
      sdPicker.skipValidation = false;
      edPicker.skipValidation = false;
    }
    else
    {
            var startDate = $('bbDateTimePickerstart').value;
            var endDate = $('bbDateTimePickerend').value;
            this.getGridCell().clearAttemptsByDate(startDate, endDate);
    }
    return false;
  },

  onViewColumnInfo: function()
  {
    var colDef = this.getGridCell().getColumnDefinition();
    this.closePopups();
    var info = colDef.getInfo();
    for ( var key in info )
    {
      if ( info.hasOwnProperty(key) )
      {
        $( key ).innerHTML = " " + info[ key ];
      }
    }
    var infoDiv = $('infodiv');
    var posX = this.htmlCell.viewportOffset( ).left;
    var offsetTop  = this.htmlCell.offsetHeight;
    var offsetLeft = 0;
    infoDiv.style.display = "block";
    var overflow = ( posX + infoDiv.offsetWidth ) - document.viewport.getWidth( ) + 20;
    if( ( overflow > 0 ) )
    {
      offsetLeft = -overflow;
    }
    $("bubbleArrowTop").className="bubArrowTop2";
    Element.clonePosition( infoDiv, this.htmlCell, { setWidth: false, setHeight: false, offsetLeft: offsetLeft, offsetTop: offsetTop } );
    if ( GradebookUtil.isFFonMac() )
    {
      GradebookGridUtil.shimDiv( infoDiv );
    }
  },

  onSendEmail : function()
  {
    var sendEmailFunc = this.grid.options.sendEmailFunc;
    if (!sendEmailFunc)
    {
      return;
    }
    var ids = [];
    ids[0] = this.getUserId();
    sendEmailFunc('S', ids);
  },

  onShowGradeDetails : function()
  {
    this.model.showGradeDetails( this.getUserId(), this.getColDefId(), this.htmlCell.id, this.gridCell.canGrade() );
  },

  onExemptGrade : function()
  {
    this.stopEdit(false, true);
    this.model.exemptGrade( this.getUserId(), this.getColDefId());
    this.closePopupsAndRestoreFocus();
  },

  onClearExemption : function()
  {
    this.model.clearExemption( this.getUserId(), this.getColDefId());
    this.closePopupsAndRestoreFocus();
  },

  onGridScroll: function()
  {
    this.closePopups();
    var done = this.unselectCurrentCell();
    page.ContextMenu.closeAllContextMenus();
    return done;
  }

};
/*
 *  Gradebook data grid
 *
 *  PORTIONS OF THIS FILE ARE BASED ON RICO LIVEGRID 1.1.2
 *
 *  Copyright 2005 Sabre Airline Solutions
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 *  file except in compliance with the License. You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the
 *  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 *  either express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 *
 *  @author "Bill Richard"
 *  @version
 *
 *
 **/

Gradebook.GridModel = Class.create();

Gradebook.GridModel.prototype =
{

  initialize : function(gradebookService)
  {
    this.gradebookService = gradebookService;
    this.courseId = gradebookService.courseId;
    this.rows = [];
    this.colDefs = [];
    this.colOrderMap = [];
    this.customViews = [];
    this.listeners = [];
    this.accessibleMode = false;
    this.resizingWindow = false;
    this.minimumRows = 10;
    this.isolatedStudentId = '';
    this.floatLocaleFormat= null;
    // singleton on this document
    this._initMessages();
    this.gridColorScheme = null;
    // stuff that needs to be stored to survive page refresh but not used by the model
    this.store = {};
    this.showNonCountingAttempts = true; // include non-counting attempts by default
    window.gbModel = this;
  },

  getFloatLocaleFormat: function()
  {
    return this.floatLocaleFormat;
  },

  setFloatLocaleFormat: function( floatLocaleFormat )
  {
    this.floatLocaleFormat = floatLocaleFormat;
    NumberFormatter.needToConvert = ( this.floatLocaleFormat.separator == ',' );
  },

  getNumberFormatter: function()
  {
    return NumberFormatter;
  },

  getObject: function( name )
  {
    return this.store[ name ];
  },

  newObject: function( name )
  {
    var newObject = {};
    this.store[ name ] = newObject;
    return newObject;
  },

  setObject: function( name, object )
  {
    this.store[ name ] = object;
    return object;
  },

  removeObject: function( name )
  {
    delete this.store[ name ];
  },

  newArray: function( name )
  {
    this[ name ] = [];
    return this[ name ];
  },

  getCustomViews : function()
  {
    this.customViews.sort(function(a, b)
    {
      var aa = a.name.toLowerCase();
      var bb = b.name.toLowerCase();
      if (aa == bb)
      {
        return 0;
      }
      else if (aa < bb)
      {
        return -1;
      }
      else
      {
        return 1;
      }
    });
    return this.customViews;
  },

  // notify registered listeners that model data has changed
  fireModelChanged : function()
  {
    if (!this.messages && this.loadingLocalizedMessages)
    {
      // wait for the messages to be loaded before to do a reload
      window.setTimeout(this.fireModelChanged.bind(this), 50);
    }
    else
    {
      for ( var i = 0; i < this.listeners.length; i++)
      {
        this.listeners[i].modelChanged();
      }
    }
  },

  // notify registered listeners that model error has occured
  fireModelError : function(exception, serverReply)
  {
    for ( var i = 0; i < this.listeners.length; i++)
    {
      if (this.listeners[i].modelError)
      {
        this.listeners[i].modelError(exception, serverReply);
      }
    }
  },

  addModelListener : function(listener)
  {
    this.listeners.push(listener);
  },

  removeModelListeners : function()
  {
    this.listeners =
      [];
  },

  updateGrade : function(newValue, newTextValue, userId, colDefId)
  {
    this.gradebookService.updateGrade((this.updateGradeCallback).bind(this), this.version, newValue, newTextValue, userId, colDefId);
  },

  clearAll : function(isDelete, userId, colDefId)
  {
    this.gradebookService.clearAll((this.updateGradeCallback).bind(this), this.version, isDelete, userId, colDefId);
  },

  clearSelected : function(attemptIds, isDelete, userId, colDefId)
  {
    this.gradebookService.clearSelected((this.updateGradeCallback).bind(this), this.version, attemptIds, isDelete, userId, colDefId);
  },

  deleteColumn : function(colDefId)
  {
    this.gradebookService.deleteColumn(colDefId);
  },

  modifyColumn : function(colDefId, colType)
  {
    this.gradebookService.modifyColumn(colDefId, colType);
  },

  reconcileGrades : function(colDefId, colType)
  {
    this.gradebookService.reconcileGrades(colDefId, colType);
  },

  viewItemStats : function(itemId)
  {
    this.gradebookService.viewItemStats(itemId);
  },

  viewSingleStudentGrades : function(userId)
  {
    this.isolatedStudentId = userId;
    this.gradebookService.reloadGrid();
  },

  restoreFromSingleStudentView : function()
  {
    this.isolatedStudentId = '';
    this.gradebookService.reloadGrid();
  },

  viewStudentStats : function(userId)
  {
    this.gradebookService.viewStudentStats(userId);
  },

   runReport : function(userId)
  {
    this.gradebookService.runReport(userId);
  },

  hideColumn : function(colDefId)
  {
    // decrement numFrozenColumns if hiding a frozen column
    var idx = this.colDefMap[colDefId];
    for ( var i = 0; i < this.colOrderMap.length; i++)
    {
      if (this.colOrderMap[i] == idx)
      {
        if (i < this.numFrozenColumns && this.numFrozenColumns > 1)
        {
          this.numFrozenColumns--;
          this.gradebookService.updateNumFrozenColumns(this.numFrozenColumns);
        }
        break;
      }
    }
    this.gradebookService.hideColumn(colDefId);
  },

  setColumnStudentVisibility : function(colDefId, visible)
  {
    this.gradebookService.setColumnStudentVisibility((this.setColumnStudentVisibilityCallback).bind(this), colDefId, visible);
  },

  showGradeDetails : function(userId, colDefId, focusCellId, isCanGrade)
  {
    this.gradebookService.showGradeDetails(userId, colDefId, focusCellId, isCanGrade);
  },

  onAddComment : function(userId, colDefId)
  {
    this.gradebookService.loadComments(userId, colDefId, "studentComments", "instructorComments");
  },

  exemptGrade : function(userId, colDefId)
  {
    this.gradebookService.setExemption((this.updateGradeCallback).bind(this), this.version, userId, colDefId, true);
  },

  clearExemption : function(userId, colDefId)
  {
    this.gradebookService.setExemption((this.updateGradeCallback).bind(this), this.version, userId, colDefId, false);
  },

  setComments : function(userId, colDefId, studentComments, instructorComments)
  {
    this.gradebookService.setComments(userId, colDefId, studentComments, instructorComments);
  },

  getRowByUserId : function(userId)
  {
    var rowIndex = this.rowUserIdMap[userId];
    if ( rowIndex === undefined || this.rows[rowIndex][0].uid != userId)
    {
      return null;
    }
    return this.rows[rowIndex];
  },

  getScoreProvider : function( scoreProviderHandle )
  {
    return this.scoreProvidersMap[ scoreProviderHandle ];
  },

  _getGradesForItemId : function(itemId, includeUnavailable)
  {
    var grades = [];
    var colIndex = this.colDefMap[itemId];
    if (!colIndex)
    {
      GradebookUtil.error('GridModel _getGradesForItemId contains data for invalid column id: ' + itemId);
      return grades;
    }
    // while the model is created from cache, we don't recreate visibleRows, we need to recreate the visibleRows when it's required.
    // Be aware, here the _getRowsByUserIds won't return the rows by the order of visibleUserIds. But for stats, the order doesn't matter.
    if(!includeUnavailable && (this.visibleRows ===null || this.visibleRows === undefined))
    {
      var visibleUserIds = GradebookCache.getObject(GradebookCache.KEY_VISIBLE_USER_IDS);
      this.visibleRows = this._getRowsByUserIds( visibleUserIds );
    }
    var rows = (includeUnavailable) ? this.rows : this.visibleRows;
    for ( var i = 0, len = rows.length; i < len; i++)
    {
      var data = rows[i][colIndex];
      if (!data.metaData)
      {
        data.metaData = rows[i][0];
      }
      if (includeUnavailable || data.metaData.isAvailable)
      {
        if (!data.colDef)
        {
          data.colDef = this.colDefs[colIndex];
        }
        grades.push(new Gradebook.GridCell(data));
      }
    }
    return grades;
  },

  getColDefById : function(itemId)
  {
    return this.colDefs[this.colDefMap[itemId]];
  },

  getColumnByIndex: function( index )
  {
    return this.colDefs[this.colOrderMap[index]];
  },

  setColumnStudentVisibilityCallback : function(retData)
  {
    if (!retData)
    {
      GradebookUtil.error('GridModel error updating column visibility');
      return;
    }
    this.getColDefById(retData.columnId).vis = retData.vis;
    this.fireModelChanged();
  },

  updateGradeCallback : function(retData)
  {
    if (!retData || retData.length === 0)
    {
      GradebookUtil.error('GridModel error updating grade');
      return;
    }
    var lastSavedDate = null;
    for ( var i = 0, len = retData.length; i < len; i++)
    {
      var data = retData[i];
      var colDefId = data.itemId;
      var userId = data.courseUserId;
      var score = data.score;
      var textInput = data.textInput;
      var row = this.getRowByUserId(userId);
      var colIndex = this.colDefMap[colDefId];
      if (!colIndex)
      {
        // ignore
        continue;
      }
      var gridCell = row[colIndex];
      gridCell.tv = textInput;
      if (textInput.length === 0 && score === 0)
      {
        gridCell.v = '-';
      }
      else
      {
        gridCell.v = score;
      }
      gridCell.or = (data.override) ? "y" : null;
      gridCell.x = (data.exempt) ? "y" : null;
      gridCell.ng = (data.needsGrading) ? "y" : null;
      gridCell.ip = (data.inProgress) ? "y" : null;
      gridCell.notExcluded = !data.excluded;
      gridCell.mp = data.points;
      gridCell.attemptsInfo = null;
      gridCell.numAtt = data.numOfAttempts;
      if ( lastSavedDate === null )
      {
        lastSavedDate = data.lastSavedDate;
      }
      gridCell.orBefAtt = data.overrideBeforeAttempt;
    }
    this.lastLogEntryTS = lastSavedDate;
    this.fireModelChanged();
  },

  setResizingWindow : function(f)
  {
    this.resizingWindow = f;
  },

  getResizingWindow : function()
  {
    return this.resizingWindow;
  },

  setMinimumRows : function(minRows)
  {
    if (minRows < 5)
    {
      minRows = 5;
    }
    if (minRows > 50)
    {
      minRows = 50;
    }
    this.minimumRows = minRows;
  },

  getMinimumRows : function()
  {
    return this.minimumRows;
  },

  getColorScheme: function( gradeCell )
  {
    // we get the color scheme by priority order
    // (in case for example the cell has a grade and is needs grading
    // then the grade range is used first)
    if ( gradeCell.isExempt() )
    {
      return "cs_ex";
    }
    var colorScheme = this.gridColorScheme;
    if ( colorScheme && gradeCell.isGraded() )
    {
      var normalizedPoints =  gradeCell.getNormalizedGrade();
      if ( normalizedPoints !== null )
      {
        normalizedPoints = normalizedPoints * 100;
        // lower bound >= value > upper bound
        for ( var i = 0; i < colorScheme.length; ++i )
        {
          var range = colorScheme[ i ];
          if ( range.u && normalizedPoints >= range.u )
          {
            continue;
          }
          if ( range.l && normalizedPoints < range.l )
          {
            continue;
          }
          return range.cid;
        }
      }
    }
    if ( gradeCell.needsGrading() )
    {
      return "cs_ng";
    }
    if ( gradeCell.attemptInProgress() )
    {
      return "cs_ip";
    }
    return "";
  },


  _reportException : function(e)
  {
    this.fireModelError(e, e.message);
  },

  _reportError : function(t)
  {
    this.fireModelError('error getting data from server', t.statusText);
  },

  getVisibleColDefIndex : function(id)
  {
    var colnum = this.colDefMap[id];
    if (colnum === undefined || this.colDefs[colnum] === undefined || !this.colDefs[colnum].gbvis)
    {
      return -1;
    }
    for ( var i = 0, len = this.colOrderMap.length; i < len; i++)
    {
      if (this.colOrderMap[i] == colnum)
      {
        return i;
      }
    }
    return -1;
  },

  updateUserVisibility : function(userId, visible)
  {
    this.gradebookService.updateUserVisibility(userId, visible);
  },

  _hasNewUsers : function(jsonBook)
  {
    if (!jsonBook || !jsonBook.rows)
    {
      return false;
    }
    for ( var i = 0; i < jsonBook.rows.length; i++)
    {
      if (!this.getRowByUserId(jsonBook.rows[i][0].uid))
      {
        return true;
      }
    }
    return false;
  },

  _containsUser : function(rows, userId)
  {
    for ( var i = 0; i < rows.length; i++)
    {
      if (rows[i][0].uid == userId)
      {
        return true;
      }
    }
    return false;
  },

  // called by view to get a window of row data
  // returns iterators to get row data in correct order while skipping hidden columns
  getRowIterators : function(startRow, numRows, startCol)
  {
    var rows = this.visibleRows;
    if (!startRow)
    {
      startRow = 0;
    }
    if (!startCol)
    {
      startCol = 0;
    }
    if (!numRows)
    {
      numRows = rows.length;
    }
    var endRow = startRow + numRows;

    if (startRow < 0 || startRow >= rows.length)
    {
      GradebookUtil.error('getRowIterators startRow out of range. Max is: ' + rows.length - 1 + ' startRow is: ' + startRow);
      return null;
    }
    if (numRows < 0 || numRows > rows.length)
    {
      GradebookUtil.error('getRowIterators numRows out of range. Max is: ' + rows.length + ' numRows is: ' + numRows);
      return null;
    }
    if (startCol < 0 || startCol >= this.colOrderMap.length)
    {
      GradebookUtil.error('getRowIterators startCol out of range. Max is: ' + this.colOrderMap.length + ' startCol is: ' + startCol);
      return null;
    }
    if (endRow > rows.length)
    {
      endRow = rows.length;
      GradebookUtil.error('Error: GridModel getRowIterators input args requesting too much data. startRow = ' + startRow + ' numRows = ' + numRows +
          ' rows.length = ' + rows.length);
      return null;
    }

    var results =
      [];
    var index = 0;
    for ( var i = startRow; i < endRow; i++)
    {
      results[index++] = new Gradebook.GridRowIterator(rows[i], this.colOrderMap, startCol, this.colDefs);
    }
    return results;
  },

  // called by view to get the column definitions
  // returns iterator to get definitions in correct order while skipping hidden columns
  getColDefIterator : function(startCol)
  {
    if (!startCol)
    {
      startCol = 0;
    }
    if (startCol < 0 || startCol >= this.colOrderMap.length)
    {
      GradebookUtil.error('getColDefIterator startCol out of range. Max is: ' + this.colOrderMap.length + ' startCol is: ' + startCol);
      return null;
    }
    return new Gradebook.ColDefIterator(this.colDefs, this.colOrderMap, startCol);
  },

  // called by view to determine how much vertical scroll is needed
  getNumRows : function()
  {
    if (this.visibleRows)
    {
      return this.visibleRows.length;
    }
    else
    {
      return 0;
    }
  },

  // called by view to determine how much horizontal scroll is needed
  getNumColDefs : function()
  {
    return this.colOrderMap.length;
  },

  // called by view to determine how many columns to freeze
  getNumFrozenColumns : function()
  {
    return this.numFrozenColumns;
  },

  getSortDir : function()
  {
    return this.sortDir;
  },

  // columnId is optional, it will return the sort index currently used if not specified
  // Also, if there is no defined sortColumnId and you pass in undefined then it will pick
  // the first column and use that to sort on.
  getSortIndex : function( columnId  )
  {
    var sortColumnId = columnId?columnId:this.sortColumnId;
    if ( !sortColumnId )
    {
      var fc = this.colOrderMap[0];
      if (fc)
      {
        var cd = this.colDefs[fc];
        if (cd)
        {
          sortColumnId = cd.id;
          if (!this.sortColumnId && sortColumnId)
          {
            this.sortColumnId = sortColumnId;
          }
        }
      }
      if (!sortColumnId)
      {
        return -1;
      }
    }
    var colnum = this.colDefMap[ sortColumnId ];
    if (colnum === undefined)
    {
      return -1;
    }
    else
    {
      var sortColumn;
      for( var i =0; i< this.colOrderMap.length; i++)
      {
        if( this.colOrderMap[i] == colnum)
        {
          sortColumn = i;
          break;
        }
      }
      if (sortColumn === undefined || this.colDefs[ sortColumn ] === undefined || this.colDefs[ sortColumn ].deleted == "Y")
      {
        return -1;
      }
      else
      {
        return sortColumn;
      }
    }
  },

  reSort : function()
  {
    if (this.sortColumnId === undefined || this.sortDir === undefined)
    {
      return;
    }
    var colnum = this.getSortIndex();
    if (colnum == -1)
    {
      return;
    }
    this.sort(colnum, this.sortDir);
  },

  setDefaultView : function(view)
  {
    this.defView = view;
    this.gradebookService.setDefaultView(view);
  },

  getDefaultView : function()
  {
    if (!this._isValidView(this.defView))
    {
      this.defView = 'fullGC';
    }
    return this.defView;
  },

  setCategoryFilter : function(category)
  {
    this.categoryFilter = category; // override category for current view
    this.checkedNoStudents( ); // clear selected when switching view/status
  },

  setStatusFilter : function(status)
  {
    if (status.startsWith("stat_"))
    {
      status = status.substr(5, status.length - 5);
    }
    this.statusFilter = status; // override status for current view
    this.checkedNoStudents( ); // clear selected when switching view/status
  },

  setInitialCurrentView : function(view)
  {
    this.initialView = view;
  },

  // set the current view to a fullGC, custom view, or grading period
  //   view param is:
  //     'fullGC' for full
  //     'cv_123' for custom views
  //     '456' for grading periods
  // if specified view is invalid, use default, if default is invalid, use full
  //
  setCurrentView : function(view)
  {
    this.categoryFilter = null; // clear category override
    this.statusFilter = null; // clear status override
    this.currentCustomView = null;
    this.currentGradingPeriodId = null;

    if (!this._isValidView(view))
    {
      view = this.defView;
    }
    if (!this._isValidView(view))
    {
      view = 'fullGC';
    }

    if (view == 'fullGC')
    {
      // use a custom view for full grade center to allow category/status overrides
      this.currentCustomView = Gradebook.CustomView.getFullGC(this);
    }
    else if (view.startsWith('cv_'))
    {
      var idx = this.customViewMap[view.substring(3)];
      this.currentCustomView = this.customViews[idx];
    }
    else if (view.startsWith('gp_'))
    {
      this.currentGradingPeriodId = view.substring(3);
    }
    this.currentView = view;
    this.checkedNoStudents( ); // clear selected when switching view
  },

  _isValidView : function(view)
  {
    if (!view)
    {
      return false;
    }
    if (view == 'fullGC')
    {
      return true;
    }
    if (view.startsWith('cv_') && this.customViewMap[ view.substring( 3 ) ] !== 'undefined' && this.customViewMap[ view.substring( 3 ) ] !== null )
    {
      var idx = this.customViewMap[view.substring(3)];
      return this.customViews[idx] && this.customViews[idx].evaluate();
    }
    if (view.startsWith('gp_'))
    {
      return this.gradingPeriodMap && this.gradingPeriodMap[view.substring(3)];
    }
    return false;
  },

  _applyCustomView : function()
  {
    var row;
    if (this.isolatedStudentId)
    {
      row = this.getRowByUserId(this.isolatedStudentId);
      if (row) 
      {
        this.visibleRows = [];
        this.visibleRows.push(row);
      } 
      else 
      {
        //In case the row per the isolated user id cannot be loaded, i.e., the user is removed from the course, restore to show all the rows.
        this.isolatedStudentId = '';
      }
    }
    if (!this.currentCustomView)
    {
      return;
    }
    this.currentCustomView.evaluate(this);
    var userIds = this.currentCustomView.getUserIds();
    if (this.isolatedStudentId)
    {
      return;
    }
    this.visibleRows = [];
    // loop through custom view users and add to visibleRows
    for ( var i = 0, len = userIds.length; i < len; i++)
    {
      row = this.getRowByUserId(userIds[i]);
      if (row)
      {
        this.visibleRows.push(row);
      }
    }
  },

  getVisibleUserIds : function()
  {
    visibleUserIds = [];
    for ( var i = 0, len = this.visibleRows.length; i < len; i++)
    {
      visibleUserIds.push(this.visibleRows[ i ][ 0 ].uid);
    }
    return visibleUserIds;
  },

  getSortedUserIds : function()
  {
    sortedUserIds = [];
    for ( var i = 0, len = this.rows.length; i < len; i++)
    {
      sortedUserIds.push(this.rows[ i ][ 0 ].uid);
    }
    return sortedUserIds;
  },

  getCustomView : function(cvId)
  {
    var idx = this.customViewMap[cvId];
    if (!idx)
    {
      return null;
    }
    else
    {
      return this.customViews[idx];
    }
  },

  getCurrentCustomView : function()
  {
    return this.currentCustomView;
  },

  getCurrentStatus : function()
  {
    if (!this.isStatusView())
    {
      return 'stat_ALL';
    }
    else if (this.statusFilter)
    {
      return this.statusFilter;
    }
    else
    {
      return this.currentCustomView.display.items;
    }
  },

  getCurrentCategory : function()
  {
    if (!this.isStatusView())
    {
      return 'c_all';
    }
    else if (this.categoryFilter)
    {
      return this.categoryFilter;
    }
    else if (this.currentCustomView.category == 'c_all')
    {
      return 'c_all';
    }
    else
    {
      return 'c_' + this.currentCustomView.aliasMap[this.currentCustomView.category];
    }
  },

  isStatusView : function()
  {
    return this.currentCustomView && this.currentCustomView.searchType == 'status';
  },

  getCurrentViewName : function()
  {
    if (this.currentCustomView)
    {
      return this.currentCustomView.name;
    }
    else if (this.currentGradingPeriodId)
    {
      return (this.gradingPeriodMap && this.gradingPeriodMap[this.currentGradingPeriodId]) ? this.gradingPeriodMap[this.currentGradingPeriodId].name : "";
    }
    else
    {
      return "";
    }
  },

  getCurrentViewStatus : function()
  {
    var s = this.getCurrentStatus();
    if (s.startsWith("stat_"))
    {
      s = s.substr(5, status.length - 5);
    }
    if (s == "ALL")
    {
      return this.getMessage('all_statusesMsg');
    }
    else if (s == "NA")
    {
      return this.getMessage('not_attemptedMsg');
    }
    else if (s == "C")
    {
      return this.getMessage('completedMsg');
    }
    else if (s == "NG")
    {
      return this.getMessage('needs_gradingMsg');
    }
    else if (s == "IP")
    {
      return this.getMessage('in_progressMsg');
    }
    else if (s == "EM")
    {
      return this.getMessage('edited_manuallyMsg');
    }
  },

  // sortColumns sorts the display order of the columns, not the contents of the columns.
  sortColumns : function(sortBy)
  {
    //sortColAscending deals with asc or desc ordering
    if ( this.sortColAscending === undefined )
    {
      window.model.sortColAscending = true;
    }

    if ( sortBy == 'asc' )
    {
      window.model.sortColAscending = true;
    }
    else if ( sortBy == 'desc' )
    {
      window.model.sortColAscending = false;
    }

    //deals with currentSortColumnBy (postion, name, etc)
    if (sortBy != 'desc' && sortBy != 'asc')
    {
      if (this.currentSortColumnBy != sortBy)
      {
        this.currentSortColumnBy = sortBy;
      }
    }
    if (!this.currentSortColumnBy)
    {
      this.currentSortColumnBy = 'pos';
    }
    var sortFunc = null;
    sortBy = this.currentSortColumnBy;
    if (sortBy == 'pos')
    {
      sortFunc = this._sortColByPosFunc.bind(this);
    }
    else if (sortBy == 'categories')
    {
      sortFunc = this._sortColByCategoriesFunc.bind(this);
    }
    else if (sortBy == 'dueDate')
    {
      sortFunc = this._sortColByDueDateFunc.bind(this);
    }
    else if (sortBy == 'creationdate')
    {
      sortFunc = this._sortColByCreationDateFunc.bind(this);
    }
    else if (sortBy == 'points')
    {
      sortFunc = this._sortColByPointsFunc.bind(this);
    }
    else if (sortBy == 'name')
    {
      sortFunc = this._sortColByNameFunc.bind(this);
    }

    var tempColDefs = [];
    var i, cd, len, idx;

    if (this.currentCustomView)
    {
      var colIds = this.currentCustomView.getDisplayItemIds();
      tempColDefs = this._getVisibleToAll(this.currentCustomView.includeHiddenItems, colIds);
      for (i = 0, len = colIds.length; i < len; i++)
      {
        cd = this.colDefs[this.colDefMap[colIds[i]]];
        tempColDefs.push(cd);
      }
    }
    else
    {
      // filter out colDefs that are: deleted, hidden, not in all grading periods
    // or not in current grading period
    for (i = 0, len = this.colDefs.length; i < len; i++)
    {
      cd = this.colDefs[i];
      if (cd.deleted || !cd.gbvis)
      {
        continue;
      }
      var cgp = this.currentGradingPeriodId;
      var ingp = (!cgp || cgp == cd.gpid || cgp == 'all' || (cgp == 'none' && !cd.gpid));
      if (cd.visAll || !cd.isGrade() || ingp)
      {
        tempColDefs.push(cd);
      }
    }
  }
  tempColDefs.sort(sortFunc);

  // compute colOrderMap based on the sorted columns
    this.colOrderMap = [];
    for (i = 0; i < tempColDefs.length; i++)
    {
      this.colOrderMap[i] = this.colDefMap[tempColDefs[i].id];
    }
  },

  _getVisibleToAll : function(includeHidden, excludeIds)
  {
    var tempColDefs =
      [];
    for ( var i = 0, len = this.colDefs.length; i < len; i++)
    {
      var cd = this.colDefs[i];
      if (excludeIds.indexOf(cd.id) != -1)
      {
        continue;
      }
      var visAll = cd.visAll || !cd.isGrade();
      if (cd.deleted || !visAll || (!includeHidden && !cd.gbvis))
      {
        continue;
      }
      tempColDefs.push(cd);
    }
    return tempColDefs;
  },

  // if both a & b are NOT visible to all, returns null
  // if both a & b are visible to all, sorts by position
  // if a is visible to all, returns -1 so visible to all columns come first
  // if b is visible to all, returns 1 so visible to all columns come first
  _sortVisibleToAll : function(a, b)
  {
    var aVisAll = a.visAll || !a.isGrade();
    var bVisAll = b.visAll || !b.isGrade();
    if (!aVisAll && !bVisAll)
    {
      return null;
    }
    else if (aVisAll && bVisAll)
    {
      return a.pos - b.pos;
    }
    else if (aVisAll)
    {
      return -1;
    }
    else if (bVisAll)
    {
      return 1;
    }
  },

  _sortColDir : function(result)
  {
    return (this.sortColAscending) ? result : result * -1;
  },

  _sortColByPosFunc : function(a, b)
  {
    var sf = this._sortVisibleToAll(a, b);
    if (sf)
    {
      return sf;
    }
    var gpPosA = this._getGradingPeriodPos(a.gpid);
    var gpPosB = this._getGradingPeriodPos(b.gpid);
    var res;
    if (gpPosA == gpPosB)
    {
      res = a.pos - b.pos;
    }
    else if (gpPosA >= 0 && gpPosB >= 0)
    {
      res = gpPosA - gpPosB;
    }
    else if (gpPosB == -1)
    {
      res = -1;
    }
    else
    {
      res = 1;
    }
    return this._sortColDir(res);
  },

  // if this.gradingPeriodMap[gpid].pos is available return it
  // else return -1
  _getGradingPeriodPos : function (gpid)
  {
    var pos = -1;
    if ( gpid && !gpid.blank() && this.gradingPeriodMap[gpid] )
    {
      pos = this.gradingPeriodMap[gpid].pos;
      if ( pos === null || pos === undefined ) // cannot do !pos here as sometimes pos is zero
      {
         pos = -1;
      }
    }
    return pos;
  },

  _sortColByPointsFunc : function(a, b)
  {
    var sf = this._sortVisibleToAll(a, b);
    if (sf)
    {
      return sf;
    }
    var aa = a.points;
    var bb = b.points;
    var res;
    if (aa == bb)
    {
      res = a.cdate - b.cdate;
    }
    else if (aa < bb)
    {
      res = -1;
    }
    else
    {
      res = 1;
    }
    return this._sortColDir(res);
  },

  _sortColByNameFunc : function(a, b)
  {
    var sf = this._sortVisibleToAll(a, b);
    if (sf)
    {
      return sf;
    }
    var aa = a.name.toLocaleLowerCase();
    var bb = b.name.toLocaleLowerCase();
    var res;
    if (aa == bb)
    {
      res = a.cdate - b.cdate;
    }
    else if (aa < bb)
    {
      res = -1;
    }
    else
    {
      res = 1;
    }
    return this._sortColDir(res);
  },

  _sortColByDueDateFunc : function(a, b)
  {
    var sf = this._sortVisibleToAll(a, b);
    if (sf)
    {
      return sf;
    }
    var aa = a.due;
    var bb = b.due;
    var res;
    if (aa == bb)
    {
      res = a.cdate - b.cdate;
    }
    else if (aa === 0)
    {
      res = 1; // items with no due date, appear after items with due date
    }
    else if (bb === 0)
    {
      res = -1; // items with no due date, appear after items with due date
    }
    else if (aa < bb)
    {
      res = -1;
    }
    else
    {
      res = 1;
    }
    return this._sortColDir(res);
  },

  _sortColByCreationDateFunc : function(a, b)
  {
    var sf = this._sortVisibleToAll(a, b);
    if (sf)
    {
      return sf;
    }
    var res = a.cdate - b.cdate;
    return this._sortColDir(res);
  },

  _sortColByCategoriesFunc : function(a, b)
  {
    var sf = this._sortVisibleToAll(a, b);
    if (sf)
    {
      return sf;
    }
    var aa = a.getCategory();
    var bb = b.getCategory();
    var res;
    if (aa == bb)
    {
      res = a.cdate - b.cdate;
    }
    else if (aa < bb)
    {
      res = -1;
    }
    else
    {
      res = 1;
    }
    return this._sortColDir(res);
  },

  sort : function(colnum, sortdir, secondaryColumnId )
  {
    if (colnum < -1 || colnum >= this.colOrderMap.length)
    {
      GradebookUtil.error('sort colnum out of range. Max is: ' + this.colOrderMap.length + ' colnum is: ' + colnum);
      return;
    }
    this.sortDir = sortdir;
    var sortFunc;
    if (colnum == -1)
    {
      this.sortColumnId = null;
      if (sortdir == 'ASC')
      {
        sortFunc = this._sortCheckedASC.bind(this);
      }
      else
      {
        sortFunc = this._sortCheckedDESC.bind(this);
      }
    }
    else
    {
      var sortColumn = this.colOrderMap[colnum];
      var colDef = this.colDefs[sortColumn];
      this.sortColumnId = colDef.id;
      if(!secondaryColumnId)
      {
        if ( this.sortColumnId == "LN" )
        {
          secondaryColumnId = this.colDefMap.FN;
        }
        else if ( this.sortColumnId == "FN" )
        {
          secondaryColumnId = this.colDefMap.LN;
        }
      }
      sortFunc = colDef.getSortFunction( sortdir, secondaryColumnId?this.colDefs[ secondaryColumnId ]:null );
    }
    // Quicksort used in Chrome is not stable (as of May 28, 2012) so we need a measure to prevent random reordering of variables with equal values
    var i;
    for ( i = 0, len = this.visibleRows.length; i < len; i++)
    {
      this.visibleRows[i].customSortKey = i;
    }
    this.visibleRows.sort(sortFunc);
    /* getStudents( includeHidden ) when includeHidden is true needs to return all students,
     * and, ideally, we want those sorted in the same way they are in the grid.
     * So to achieve this, rows and visibleRows are kept in sync. Note that if they
     * are equal, then getStudents will use visibleRows so no need to sync.
     * This is not ideal as we do 2 sorts here. Possibly we could store the last used sort
     * function and apply when getStudents is called. It would not be perfect as it would
     * not retain secondary sort, but that might be enough (or retain the last 2 sort functions)?
     */
    if ( this.visibleRows.size() != this.rows.size() )
    {
      // Quicksort used in Chrome is not stable (as of May 28, 2012) so we need a measure to prevent random reordering of variables with equal values
      for ( i = 0, len = this.rows.length; i < len; i++)
      {
        this.rows[i].customSortKey = i;
      }
      this.rows.sort(sortFunc);
      for ( i = 0, len = this.rows.length; i < len; i++)
      {
        var c = this.rows[i][0];
        this.rowUserIdMap[c.uid] = i;
      }
    }
  },

  _sortCheckedASC : function(a, b)
  {
    var aa = a[0].isRowChecked ? 1 : 0;
    var bb = b[0].isRowChecked ? 1 : 0;
    if (aa == bb)
    {
      if (aa)
      {
        return 0;
      }
      else
      {
        return (a.customSortKey > b.customSortKey ? -1 : 1);
      }
    }
    if (aa < bb)
    {
      return -1;
    }
    return 1;
  },

  _sortCheckedDESC : function(a, b)
  {
    var aa = a[0].isRowChecked ? 1 : 0;
    var bb = b[0].isRowChecked ? 1 : 0;
    if (aa == bb)
    {
      if (aa)
      {
        return 0;
      }
      else
      {
        return (a.customSortKey > b.customSortKey ? 1 : -1);
      }
    }
    if (bb < aa)
    {
      return -1;
    }
    return 1;
  },

  // called by cumultive item authoring and reporting
  getColDefs : function(gradeColumnsOnly, includeHidden)
  {
    var colDefs = this.colDefs;
    var retColDefs =
      [];
    for ( var i = 0, len = colDefs.length; i < len; i++)
    {
      var c = colDefs[i];
      if (!c.deleted && (!gradeColumnsOnly || c.isGrade()) && (includeHidden || !c.isHidden()))
      {
        retColDefs.push(c);
      }
    }
    return retColDefs;
  },

  // called by grade detail page and report page
  getCurrentColDefs : function(includeCalculated)
  {
    var colDefs = this.colDefs;
    var retColDefs =
      [];
    for ( var i = 0, len = this.colOrderMap.length; i < len; i++)
    {
      var c = colDefs[this.colOrderMap[i]];
      if (c.isGrade() && (includeCalculated || !c.isCalculated()))
      {
        retColDefs.push(c);
      }
    }
    return retColDefs;
  },

  // called by grade detail page
  getNextColDefId : function(colDefs, colDefId)
  {
    for ( var i = 0; i < colDefs.length - 1; i++)
    {
      if (colDefs[i].getID() == colDefId)
      {
        return colDefs[i + 1].getID();
      }
    }
    return null;
  },

  // called by grade detail page
  getPrevColDefId : function(colDefs, colDefId)
  {
    for ( var i = 1; i < colDefs.length; i++)
    {
      if (colDefs[i].getID() == colDefId)
      {
        return colDefs[i - 1].getID();
      }
    }
    return null;
  },

  getStudents : function(includeHidden)
  {
    /* if includeHidden = true, it is still possible that visibleRows == rows.
     * We sort rows only if rows != visibleRows, according to the sort function
     */
    var rows = (includeHidden && (!this.visibleRows || this.visibleRows.size() != this.rows.size()) ) ? this.rows : this.visibleRows;
    var students = [];
    if (rows)
    {
      // NOTE: We are no longer re-sorting the rows here.  Instead we will honor whatever sort order
      // the user had previously chosen in the grid.  This makes the sorting of grading consistent
      // across different views.  (Confirmed change with Erika)
      for ( var i = 0; i < rows.length; i++)
      {
        var row = rows[i];
        students.push(this._generateStudentByRow(row));
      }
    }
    return students;
  },

  // called by grade details page, student statistics pages and Row Visibility page, View Attempt page,
  // and Add/Modify Smart View page
  getStudentsByUserIds : function(userIds)
  {
    var students = [];
    if(!userIds)
    {
      return this.getStudents(true);
    }
    else
    {
      // NOTE: We are no longer re-sorting the rows here.  Instead we will honor whatever sort order
      // the user had previously chosen in the grid.  This makes the sorting of grading consistent
      // across different views.  (Confirmed change with Erika)
      for ( var i = 0; i < userIds.length; i++)
      {
        var row;
        row = this.getRowByUserId(userIds[i]);
        students.push(this._generateStudentByRow(row));
      }
    }
    return students;
  },

  _generateStudentByRow: function(row)
  {
    var LAST_NAME_COL_IDX = 0;
    var FIRST_NAME_COL_IDX = 1;
    var USER_NAME_COL_IDX = 2;
    var s = {};
    s.last = row[LAST_NAME_COL_IDX].v;
    s.sortval = row[LAST_NAME_COL_IDX].sortval;
    s.first = row[FIRST_NAME_COL_IDX].v;
    s.user = row[USER_NAME_COL_IDX].v;
    s.id = row[0].uid;
    s.hidden = row[0].isHidden;
    s.available = row[0].isAvailable;
    return s;
  },

  // called by cumulative item page
  getGradingPeriods : function()
  {
    return this.gradingPeriods;
  },

  // called by cumulative item page
  getCategories : function()
  {
    return this.categories;
  },

  // called by grade detail page; returns null if invalid colId
  getRawValue : function(colId, displayValue)
  {
    var colIndex = this.colDefMap[colId];
    if (colIndex === undefined)
    {
      return null;
    }
    var colDef = this.colDefs[colIndex];
    return colDef.getRawValue(displayValue);
  },

  // called by grade detail page; returns null if invalid colId
  getDisplayValue : function(colId, rawValue)
  {
    var colIndex = this.colDefMap[colId];
    if (colIndex === undefined)
    {
      return null;
    }
    var colDef = this.colDefs[colIndex];
    return colDef.getDisplayValue(rawValue);
  },

  // called by grade detail page; returns null if invalid colId
  getDisplayType : function(colId)
  {
    var colIndex = this.colDefMap[colId];
    if (colIndex === undefined)
    {
      return null;
    }
    var colDef = this.colDefs[colIndex];
    return colDef.getDisplayType();
  },

  // called by grade detail page; returns validate error or null if no error
  validate : function(colId, newValue)
  {
    var colIndex = this.colDefMap[colId];
    if (colIndex === undefined)
    {
      return null;
    }
    var colDef = this.colDefs[colIndex];
    return colDef.validate(newValue);
  },

  getCheckedStudentIds : function()
  {
    var rows = this.visibleRows;
    var students =
      [];
    for ( var i = 0, len = rows.length; i < len; i++)
    {
      if (rows[i][0].isRowChecked)
      {
        students.push(rows[i][0].uid);
      }
    }
    return students;
  },

  checkedAllStudents : function()
  {
    var rows = this.visibleRows;
    for ( var i = 0, len = rows.length; i < len; i++)
    {
      rows[i][0].isRowChecked = true;
    }
    this.fireModelChanged();

  },

  checkedNoStudents : function()
  {
    var rows = this.visibleRows;
    if ( rows )
    {
      for ( var i = 0, len = rows.length; i < len; i++)
      {
        rows[i][0].isRowChecked = false;
      }
      this.fireModelChanged();
    }
  },

  invertCheckedStudents : function()
  {
    var rows = this.visibleRows;
    for ( var i = 0, len = rows.length; i < len; i++)
    {
      rows[i][0].isRowChecked = !rows[i][0].isRowChecked;
    }
    this.fireModelChanged();
  },

  checkedRangeOfStudents : function(uid1, uid2)
  {
    var startId;
    var rows = this.visibleRows;
    for ( var i = 0, len = rows.length; i < len; i++)
    {
      var uid = rows[i][0].uid;
      if (!startId && (uid != uid1 && uid != uid2))
      {
        continue;
      }
      else if (!startId && uid == uid1)
      {
        startId = uid;
      }
      else if (!startId && uid == uid2)
      {
        startId = uid;
      }
      else if (uid == uid1 || uid == uid2)
      {
        break;
      }
      else
      {
        rows[i][0].isRowChecked = true;
      }
    }
    this.fireModelChanged();
  },

  clearAttempts : function(colId, clearOption, startDate, endDate)
  {
    this.gradebookService.clearAttempts(colId, clearOption, startDate, endDate);
  },

  updateGroups : function()
  {
    var crsId = this.courseId;
    if (crsId.indexOf("_") >= 0)
    {
      crsId = crsId.split("_")[1];
    }
    var gradeCenterContentFrame = window.frames.gradecenterframe; // Grade Center Frame in SSL mode
    if (!gradeCenterContentFrame)
    {
      gradeCenterContentFrame = top; // regular course content frame
    }
    if (!gradeCenterContentFrame.GradebookDWRFacade)
    {
      // name below is defined by the ultra-ui in /app/features/course/course-classic.html - keep in sync
      gradeCenterContentFrame = top.frames['classic-learn-iframe'];
    }
    if ( gradeCenterContentFrame.GradebookDWRFacade )
    {
      gradeCenterContentFrame.GradebookDWRFacade.getGroups(crsId, Gradebook.GridModel.prototype.updateGroupsCallback);
    }
  },

  updateGroupsCallback : function(retData)
  {
    var groupsMap = [];
    var groups = [];
    var h = $H(retData);
    h.each(function(pair)
    {
      var g = {};
      g.id = pair.key;
      g.uids = pair.value;
      groupsMap[g.id] = groups.length;
      groups.push(g);
    });
    var model = Gradebook.getModel();
    model.groupsMap = groupsMap;
    model.groups = groups;
  },

  // used by reporting
  getReportData : function(reportDef)
  {
    var LAST_NAME_COL_IDX = 0;
    // get rows for students to include in report
    var userIds = null;
    if (reportDef.students == 'BYGROUPS')
    {
      if (!reportDef.groupIds)
      {
        GradebookUtil.error('GridModel error getReportData: no reportDef.groupIds');
        return null;
      }
      userIds = this._getUserIdsByGroupIds(reportDef.groupIds);
    }
    else if (reportDef.students == 'BYSTUDENT')
    {
      if (!reportDef.studentIds)
      {
        GradebookUtil.error('GridModel error getReportData: no reportDef.studentIds');
        return null;
      }
      userIds = reportDef.studentIds;
    }
    var rows = this._getRowsByUserIds(userIds);
    if (!reportDef.includeHiddenStudents)
    {
      rows = this._removeHiddenStudents(rows);
    }
    // get columns to include in report
    var colDefs;
    if ( reportDef.columns == 'GRID_VIEW' )
    {
      colDefs = this.getCurrentColDefs(true);
    }
    else if ( reportDef.columns == 'ALLITEMS' )
    {
      colDefs = this.getColDefs( true/*only grade columns*/, reportDef.includeHiddenColumns );
      colDefs.sort( this._sortColByPosFunc.bind(this) ); // sort by position
    }
    else
    {
      if (reportDef.columns == 'BYITEM')
      {
        colDefs = this._getColDefsById(reportDef.itemIds);
      }
      else if (reportDef.columns == 'BYGP')
      {
        colDefs = this._getColDefsByGradingPeriodId(reportDef.gradingPeriodIds);
      }
      else if (reportDef.columns == 'BYCAT')
      {
        colDefs = this._getColDefsByCategoryId(reportDef.categoryIds);
      }
      if (!reportDef.includeHiddenColumns)
      {
        colDefs = this._removeHiddenColumns(colDefs);
      }
      colDefs.sort( this._sortColByPosFunc.bind(this) ); // sort by position
    }

    //before printing the report, sort on student's last name,according to PM's requirement
    rows.sort(function(a, b)
    {
      var aa = a[LAST_NAME_COL_IDX].sortval;
      var bb = b[LAST_NAME_COL_IDX].sortval;
      if (aa == bb)
      {
        return 0;
      }
      else if (aa < bb)
      {
        return -1;
      }
      else
      {
        return 1;
      }
    });
    // create return data structure
    var reportData =
    {};
    reportData.columnInfoMap = [];
    reportData.studentGradeInfo = [];

    var i, len, len0;

    // add column data
    for (i = 0, len = colDefs.length; i < len; i++)
    {
      var cdef = colDefs[i];
      var cdata = {};
      reportData.columnInfoMap[cdef.id] = cdata;
      cdata.name = cdef.getName();
      if (reportDef.columnInfoDescription)
      {
        cdata.description = 'tbd'; // server will provide desc map
      }
      if (reportDef.columnInfoDueDate)
      {
        cdata.dueDate = cdef.getDueDate();
      }
      if (reportDef.columnInfoStatsMedian || reportDef.columnInfoStatsAverage)
      {
        var stats = cdef.getStats(true); // include unavailable students
        cdata.statsMedian = stats.median;
        cdata.statsAverage = stats.avg;
      }
    }

    // add student data
    for (i = 0, len0 = rows.length; i < len0; i++)
    {
      var row = rows[i];
      var rd =
      {};
      reportData.studentGradeInfo.push(rd);

      if (reportDef.firstName)
      {
        rd.firstName = this._getStudentAttribute(row, 'FN');
      }
      if (reportDef.lastName)
      {
        rd.lastName = this._getStudentAttribute(row, 'LN');
      }
      if (reportDef.studentId)
      {
        rd.studentId = this._getStudentAttribute(row, 'SI');
      }
      if (reportDef.userName)
      {
        rd.userName = this._getStudentAttribute(row, 'UN');
      }
      if (reportDef.lastAccessed)
      {
        rd.lastAccessed = this._getStudentAttribute(row, 'LA');
        if (rd.lastAccessed && rd.lastAccessed > 0)
        {
          var date = new Date();
          date.setTime(rd.lastAccessed);
          rd.lastAccessed = formatDate(date, 'MMM d, y');
        }
      }
      rd.grades = [];
      for ( var c = 0, len1 = colDefs.length; c < len1; c++)
      {
        var g =
        {};
        g.cid = colDefs[c].id;
        var gridCell = this._getGrade(row, colDefs[c]);
        //check for anonymous first for report data
        if ( gridCell.isAnonymous() )
        {
          g.grade = gridCell.getCellValue();
        }
        else if (gridCell.attemptInProgress() && !gridCell.isOverride())
        {
          g.grade = this.getMessage('inProgressMsg');
        }
        else if (gridCell.needsGrading() && !gridCell.isOverride())
        {
          g.grade = this.getMessage('needsGradingMsg');
        }
        else
        {
          g.grade = gridCell.getCellValue();
        }
        rd.grades.push(g);
      }
    }
    return reportData;
  },

  _getGrade : function(row, colDef)
  {
    var colIndex = this.colDefMap[colDef.id];
    if (!colIndex)
    {
      GradebookUtil.error('GridModel _getGrade invalid column id: ' + colDef.id);
      return null;
    }
    var data = row[colIndex];
    if (!data.metaData)
    {
      data.metaData = row[0];
    }
    if (!data.colDef)
    {
      data.colDef = colDef;
    }
    return new Gradebook.GridCell(data);
  },

  _getStudentAttribute : function(row, colDefId)
  {
    var colIndex = this.colDefMap[colDefId];
    if ( Object.isUndefined( colIndex ) )
    {
      GradebookUtil.error('GridModel _getStudentAttribute invalid column id: ' + colDefId);
      return null;
    }
    return row[colIndex].v;
  },

  _removeHiddenStudents : function(students)
  {
    var retStudents = [];
    for ( var i = 0, len = students.length; i < len; i++)
    {
      if (!students[i][0].isHidden)
      {
        retStudents.push(students[i]);
      }
    }
    return retStudents;
  },

  _removeHiddenColumns : function(colDefs)
  {
    var retColDefs =  [];
    for ( var i = 0, len = colDefs.length; i < len; i++)
    {
      if (!colDefs[i].isHidden())
      {
        retColDefs.push(colDefs[i]);
      }
    }
    return retColDefs;
  },

  _getColDefsById : function(itemIds)
  {
    var colDefs = [];
    for ( var i = 0, len = this.colDefs.length; i < len; i++)
    {
      if (itemIds.indexOf(this.colDefs[i].id) != -1)
      {
        colDefs.push(this.colDefs[i]);
      }
    }
    return colDefs;
  },

  _getColDefsByCategoryId : function(categoryIds)
  {
    var colDefs =
      [];
    for ( var i = 0, len = this.colDefs.length; i < len; i++)
    {
      if (categoryIds.indexOf(this.colDefs[i].catid) != -1)
      {
        colDefs.push(this.colDefs[i]);
      }
    }
    return colDefs;
  },

  _getColDefsByGradingPeriodId : function(gradingPeriodIds)
  {
    var colDefs =
      [];
    for ( var i = 0, len = this.colDefs.length; i < len; i++)
    {
      if (gradingPeriodIds.indexOf(this.colDefs[i].gpid) != -1)
      {
        colDefs.push(this.colDefs[i]);
      }
    }
    return colDefs;
  },

  _getRowsByUserIds : function(userIds)
  {
    var rows = this.rows;
    if (!userIds)
    {
      return rows;
    }
    var retRows =
      [];
    for ( var i = 0, len = rows.length; i < len; i++)
    {
      if (userIds.indexOf(rows[i][0].uid) != -1)
      {
        retRows.push(rows[i]);
      }
    }
    return retRows;
  },

  _getUserIdsByGroupIds : function(groupIds)
  {
    if (!this.groupsMap || !this.groups)
    {
      GradebookUtil.error('GridModel error getUserIdsByGroupIds: no groups');
      return null;
    }
    var userIds = [];
    for ( var i = 0; i < groupIds.length; i++)
    {
      var index = this.groupsMap[Number(groupIds[i])];
      if ( undefined === index )
      {
        GradebookUtil.error('GridModel error getUserIdsByGroupIds: no group for id: ' + groupIds[i]);
        continue;
      }
      var group = this.groups[index];
      for ( var g = 0; g < group.uids.length; g++)
      {
        if (userIds.indexOf(group.uids[g]) == -1)
        {
          userIds.push(String(group.uids[g]));
        }
      }
    }
    return userIds;
  },

  // called by student stats page
  getStudentStats : function(userId, currentViewOnly)
  {
    var studentStats =
    {};
    studentStats.catStats =
      [];
    var catMap =
      [];
    var i, catStat;

    // get columns, either all or current view
    var colDefs =
      [];
    var len = currentViewOnly ? this.colOrderMap.length : this.colDefs.length;
    for (i = 0; i < len; i++)
    {
      var idx = currentViewOnly ? this.colOrderMap[i] : i;
      var c = this.colDefs[idx];
      if (!c.deleted && c.isGrade() && !c.isCalculated())
      {
        colDefs.push(c);
      }
    }

    var row = this.getRowByUserId(userId);

    for (i = 0; i < colDefs.length; i++)
    {
      var colDef = colDefs[i];
      var catId = colDef.getCategoryID();
      catStat = catMap[catId];
      if (!catStat)
      {
        catStat =
        {};
        catStat.name = colDef.getCategory();
        catStat.qtyGraded = 0;
        catStat.qtyInProgress = 0;
        catStat.qtyNeedsGrading = 0;
        catStat.qtyExempt = 0;
        catStat.sum = 0;
        catStat.avg = 0;
        catMap[catId] = catStat;
        studentStats.catStats.push(catStat);
      }
      var grade = this._getGrade(row, colDef);
      var val = grade.getValue();
      var isNull = (val == '-');
      var isIP = grade.attemptInProgress();
      var isNG = grade.needsGrading();
      var isExempt = grade.isExempt();
      var isVal = (!isNull && !isIP && !isNG && !isExempt);
      if (isIP)
      {
        catStat.qtyInProgress++;
      }
      else if (isNG)
      {
        catStat.qtyNeedsGrading++;
      }
      else if (isExempt)
      {
        catStat.qtyExempt++;
      }

      if (isVal)
      {
        catStat.qtyGraded++;
        if (colDef.isCalculated())
        {
          val = parseFloat(val) / parseFloat(grade.getPointsPossible()) * 100.0;
        }
        catStat.sum += parseFloat(val);
      }
    }
    studentStats.numItemsCompleted = 0;
    var totNumExempt = 0;
    for (i = 0; i < studentStats.catStats.length; i++)
    {
      catStat = studentStats.catStats[i];
      if (catStat.sum > 0)
      {
        catStat.avg = catStat.sum / parseFloat(catStat.qtyGraded);
        catStat.avg = NumberFormatter.formatScoreTruncate( catStat.avg );
      }
      totNumExempt += catStat.qtyExempt;
      studentStats.numItemsCompleted += (catStat.qtyNeedsGrading + catStat.qtyGraded);
    }
    studentStats.numItems = colDefs.length - totNumExempt;
    return studentStats;
  },

  getAccessibleMode : function()
  {
    return this.accessibleMode;
  },

  setAccessibleMode : function(accessibleMode)
  {
    this.accessibleMode = accessibleMode;
  },

  getUserCanViewGradebookAttempts : function()
  {
    return this.userCanViewGradebookAttempts;
  },

  setUserCanViewGradebookAttempts : function( userCanViewGradebookAttempts )
  {
    this.userCanViewGradebookAttempts = userCanViewGradebookAttempts;
  },

  getUserCanViewGradebookGrades : function()
  {
    return this.userCanViewGradebookGrades;
  },

  setUserCanViewGradebookGrades : function( userCanViewGradebookGrades )
  {
    this.userCanViewGradebookGrades = userCanViewGradebookGrades;
  },

  getUserCanEnterGradingFeedback : function()
  {
    return this.userCanEnterGradingFeedback;
  },

  setUserCanEnterGradingFeedback : function( userCanEnterGradingFeedback )
  {
    this.userCanEnterGradingFeedback = userCanEnterGradingFeedback;
  },

  getUserCanEnterAttemptGrades : function()
  {
    return this.userCanEnterAttemptGrades;
  },

  setUserCanEnterAttemptGrades : function( userCanEnterAttemptGrades )
  {
    this.userCanEnterAttemptGrades = userCanEnterAttemptGrades;
  },
  
  getUserCanOverrideGrades : function() 
  {
    return this.userCanOverrideGrades;
  },
  
  setUserCanOverrideGrades : function( userCanOverrideGrades )
  {
    this.userCanOverrideGrades = userCanOverrideGrades;
  },

  getUserHasFullGradebookAccess : function()
  {
    return this.userHasFullGradebookAccess;
  },

  setUserHasFullGradebookAccess : function( userHasFullGradebookAccess )
  {
    this.userHasFullGradebookAccess = userHasFullGradebookAccess;
  },

  getUserCanPerformAllGradingActions : function()
  {
    return this.userCanPerformAllGradingActions;
  },

  setUserCanPerformAllGradingActions : function( userCanPerformAllGradingActions )
  {
    this.userCanPerformAllGradingActions = userCanPerformAllGradingActions;
  },

  setMessages : function(messages)
  {
    this.messages = messages;
  },

  getMessage : function(key, args)
  {
    if (this.messages)
    {
      if( args ) {
        var msgTemplate = new Template(this.messages[key]);
        return msgTemplate.evaluate(args);
      } else {
        return this.messages[key];
      }
    }
    else
    {
      return key;
    }
  },

  // returns found row index or null if no matches found.
  // textToFind will be checked (startsWith) against the value of each column in a given row
  // optional rowIncrement is +1 for find next or -1 for find previous, default is +1
  // startingRowIndex allows for find next/previous, default is 0

  findText: function( textToFind, rowIncrement, startingRowIndex )
  {
    if ( startingRowIndex === undefined )
    {
      startingRowIndex = 0;
    }
    if ( rowIncrement === undefined )
    {
      rowIncrement = 1;
    }
    if ( startingRowIndex < 0 || startingRowIndex >= this.visibleRows.length - 1 || !textToFind || ( rowIncrement != 1 && rowIncrement != -1 ) )
    {
      return null;
    }
    var col;
    var rowIndex = startingRowIndex;
    while ( true )
    {
      if ( ( col = this._findTextInRow( this.visibleRows[rowIndex], textToFind ) ) !== null )
      {
        var loc = {};
        loc.row = rowIndex;
        loc.col = col;
        return loc;
      }
      rowIndex = rowIndex + rowIncrement;
      if ( rowIndex < 0 ) // check for wrap
      {
        rowIndex = this.visibleRows.length - 1;
      }
      else if ( rowIndex == this.visibleRows.length ) // check for wrap
      {
        rowIndex = 0;
      }
      if ( rowIndex == startingRowIndex )
      {
        return null; // all done, no match found
      }
    }
  },

  _findTextInRow: function( row, textToFind )
  {
    var gridCell = new window.Gradebook.GridCell();
    var iterator = new Gradebook.GridRowIterator( row, this.colOrderMap, 0, this.colDefs );
    var col = 0;
    while ( iterator.hasNext() )
    {
      gridCell.setData( iterator.next() );
      if ( gridCell.getCellValue().indexOf( textToFind ) != -1 )
      {
        return col;
      }
      col++;
    }
    return null;
  }


};

////////////////////////////Utility //////////////////////////////////////

Gradebook.GridRowIterator = Class.create();

Gradebook.GridRowIterator.prototype =
{
  initialize : function(dataArray, orderMap, startIndex, colDefs)
  {
    this.dataArray = dataArray;
    this.orderMap = orderMap;
    this.currentIndex = startIndex;
    this.colDefs = colDefs;
  },

  hasNext : function()
  {
    return this.currentIndex < this.orderMap.length;
  },

  next : function()
  {
    if (this.currentIndex >= this.orderMap.length)
    {
      GradebookUtil.error('GridRowIterator out of data. length = ' + this.orderMap.length);
      return null;
    }
    var idx = this.orderMap[this.currentIndex++];
    var data = this.dataArray[idx];
    // add colDef & metedata reference to cell data, if not already there
    if (!data.colDef)
    {
      data.colDef = this.colDefs[idx];
    }
    if (!data.metaData)
    {
      data.metaData = this.dataArray[0]; // first cell is extended with metadata
    }
    return data;
  }
};

Gradebook.ColDefIterator = Class.create();

Gradebook.ColDefIterator.prototype =
{
  initialize : function(dataArray, orderMap, startIndex)
  {
    this.dataArray = dataArray;
    this.orderMap = orderMap;
    this.currentIndex = startIndex;
  },
  hasNext : function()
  {
    return this.currentIndex < this.orderMap.length;
  },
  next : function()
  {
    if (this.currentIndex >= this.orderMap.length)
    {
      GradebookUtil.error('ColDefIterator out of data. length = ' + this.orderMap.length);
      return null;
    }
    return this.dataArray[this.orderMap[this.currentIndex++]];
  }
};

Gradebook.numberComparator = function(a, b)
{
  return a - b;
};

var NumberFormatter =
{

  // usually called from frameset scope and re-set when the locale format is set on the model
  needToConvert : false,


  thousandsSeparator : ( typeof LOCALE_SETTINGS === 'undefined' || LOCALE_SETTINGS.getString('number_format.thousands_sep') === null ) ? ',' : LOCALE_SETTINGS.getString('number_format.thousands_sep'),
  decimalSeparator   : ( typeof LOCALE_SETTINGS === 'undefined' || LOCALE_SETTINGS.getString('number_format.decimal_point') === null ) ? '.' : LOCALE_SETTINGS.getString('number_format.decimal_point'),

  formatScoreTruncate: function( num )
  {
    return gradebook_utils.formatScoreTruncate( num );
  },

  formatPointsTruncate: function( num )
  {
    return gradebook_utils.getNumberLocalizer().formatPoints( num, true /* truncate */ );
  },

  //takes an unlocalized number (either String or Number) and converts it to a localized string version
  // for numeric strings that need a controlled length, use formatScoreTruncate or formatPointsTruncate instead
  getDisplayFloat : function(f)
  {
    f = '' + f;

    if ( NumberFormatter.thousandsSeparator !== ',' )
    {
      f = f.replace( ',', '[comma]' );
    }

    if ( NumberFormatter.decimalSeparator !== '.' )
    {
      f = f.replace( '.', NumberFormatter.decimalSeparator );
    }

    if ( NumberFormatter.thousandsSeparator !== ',' )
    {
      f = f.replace( '[comma]', NumberFormatter.thousandsSeparator );
    }

    return f;
  },

  //takes a localized String number and connverts it to an unlocalized String version
  getDotFloat : function(f)
  {
    f = '' + f;
    f = f.replace( NumberFormatter.thousandsSeparator, '' );
    if ( NumberFormatter.decimalSeparator !== '.' )
    {
      f = f.replace( NumberFormatter.decimalSeparator, '.' );
    }
    return f;
  },

  parseLocaleFloat: function ( num )
  {
    if ( !num )
    {
      return NaN;
    }
    var dotFloat = NumberFormatter.getDotFloat( num );
    return parseFloat( dotFloat );
  }
};

var GradeScoreDesignation = {
  AttemptScore: 'a',
  OverrideScore: 'm',
  None: ''
};var MAX_DELTA_NUM =50;
// called to load model with server data
Gradebook.GridModel.prototype.requestLoadData = function(forceFlush)
{
  //The current view info should be kept
  var initialView = GradebookCache.getString(GradebookCache.KEY_CURRENT_VIEW);
  if(initialView!==null && initialView!==undefined)
  {
    this.initialView = initialView;
    GradebookCache.clear();
    this.deltaJsonNum=0;
  }
  GradebookCache.setString(GradebookCache.KEY_LAST_JSON_UPDATE_TIME, new Date().getTime());
  this.gradebookService.requestLoadData((this._loadDataFromJSON).bind(this), (this._reportError).bind(this), (this._reportException).bind(this), forceFlush);
};


// called to update model with server data
Gradebook.GridModel.prototype.requestUpdateData = function()
{
  var lastUpdateTime = GradebookCache.getString(GradebookCache.KEY_LAST_JSON_UPDATE_TIME);
  var timeSinceLastUpdate = new Date().getTime() - lastUpdateTime;
  // don't update if window is resizing and we've reloaded in the last 5
  // minutes
  if (!this.usingCachedBook && this.resizingWindow && (timeSinceLastUpdate < 5 * 60 * 1000))
  {
    this.fireModelChanged();
    return;
  }
  GradebookCache.setString(GradebookCache.KEY_LAST_JSON_UPDATE_TIME, new Date().getTime());
  var customViewId = null;
  if (this.currentCustomView && this.currentCustomView.usesGroups())
  {
    customViewId = this.currentCustomView.id;
  }
  var version = GradebookCache.getString(GradebookCache.KEY_VERSION);
  var lastUserChangeTime = GradebookCache.getString(GradebookCache.KEY_LAST_USER_CHANGE_TIME);
  var userHash = GradebookCache.getString(GradebookCache.KEY_USERS_HASH);
  var scoreProvidersHash = GradebookCache.getString(GradebookCache.KEY_SCORE_PROVIDER_HASH);
  this.gradebookService.requestUpdateData(version, lastUserChangeTime, userHash, scoreProvidersHash, customViewId, (this._updateDataFromJSON).bind(this),
      (this._reportError).bind(this), (this._reportException).bind(this));
};

Gradebook.GridModel.prototype.loadDataFromCache = function()
{
  var cachedFullJsonBook = GradebookCache.getObject(GradebookCache.KEY_JSON_FULL);
  var cachedDeltaJsonBooks = GradebookCache.getObject(GradebookCache.KEY_JSON_DELTA);

  this._loadDataFromJsonBook(cachedFullJsonBook, true);

  // load cached delta json data
  if ( cachedDeltaJsonBooks)
  {
    this.deltaJsonNum = cachedDeltaJsonBooks.length;
    for ( var i = 0; i < cachedDeltaJsonBooks.length; i++ )
    {
      this._appendJSONDataToModel( cachedDeltaJsonBooks[ i ], true );
    }
  }
};

function registerScoreProviderActionController( controller, ctrlJsName )
{
  var model = Gradebook.getModel();
  for (var i in model.scoreProviderActionsMap)
  {
    if ( model.scoreProviderActionsMap.hasOwnProperty( i ) )
    {
      var action = model.scoreProviderActionsMap[i];
      if (action.controlLogic && action.controlLogic.indexOf( ctrlJsName ) > -1)
      {
        action.controller = controller;
        return;
      }
    }
  }
}

// callback when initializing this gradebook model with server data
Gradebook.GridModel.prototype._loadDataFromJSON = function(reply)
{
  var jsonBook;
  try
  {
    if (typeof (JSON) === 'object' && typeof (JSON.parse) === 'function')
    {
      jsonBook = JSON.parse(reply.responseText);
    }
    else
    {
      jsonBook = eval('(' + reply.responseText + ')');
    }
    if (jsonBook.cachedBook)
    {
      // user specific data is data added ontop of the cached data to replace
      // part of the cached data (since the cached data is per course, not per user)
      // right now there are only two per-user data: 
      //  the edit content for item in score provider, and assignment reconcile privleges
      if ( jsonBook.currentUserData && jsonBook.currentUserData.scoreProvidersCurrentUser )
      {
        jsonBook.cachedBook.scoreProvidersCurrentUser = jsonBook.currentUserData.scoreProvidersCurrentUser;
      }
      if ( jsonBook.currentUserData && jsonBook.currentUserData.reconcilerColumnPermissions )
      {
        for ( var k = 0; k < jsonBook.cachedBook.colDefs.length; k++ )
        {
          if ( jsonBook.cachedBook.colDefs[k].isDeleg !== true ) continue; // skip assignments that are not Delegated
          var columnPermission = jsonBook.currentUserData.reconcilerColumnPermissions[jsonBook.cachedBook.colDefs[k].id];
          if ( columnPermission != null )
          {
            jsonBook.cachedBook.colDefs[k].userCanReconcile = columnPermission.userCanReconcile;
          }
        }
      }
      jsonBook = jsonBook.cachedBook;
      this.usingCachedBook = true;
      GradebookCache.setObject( GradebookCache.KEY_JSON_FULL, jsonBook );
    }
    else
    {
      GradebookCache.setString( GradebookCache.KEY_JSON_FULL, reply.responseText );
    }
    GradebookCache.setString( GradebookCache.KEY_COURSE_ID, this.courseId );
    GradebookCache.setString( GradebookCache.KEY_VERSION, jsonBook.version );
    GradebookCache.setString( GradebookCache.KEY_LAST_USER_CHANGE_TIME, jsonBook.lastUserChangeTS );
    GradebookCache.setString( GradebookCache.KEY_USERS_HASH, jsonBook.usersHash );
    GradebookCache.setString( GradebookCache.KEY_SCORE_PROVIDER_HASH, jsonBook.scoreProvidersHash );
  }
  catch (e)
  {
    this.fireModelError(e, reply.responseText);
    return;
  }
  this._loadDataFromJsonBook(jsonBook, false);
};

Gradebook.GridModel.prototype._loadDataFromJsonBook = function(jsonBook, isCachedJsonBook)
{
    try
    {
      this.schemaMap = [];
      var i, len;
      for (i = 0; i < jsonBook.schemas.length; i++)
      {
        jsonBook.schemas[i] = this._createSchema(jsonBook.schemas[i].type, jsonBook.schemas[i]);
        this.schemaMap[jsonBook.schemas[i].id] = jsonBook.schemas[i];
      }
      this.colDefMap = [];
      for (i = 0; i < jsonBook.colDefs.length; i++)
      {
        jsonBook.colDefs[i] = this._createColDef(jsonBook.colDefs[i], this, this.schemaMap);
        this.colDefMap[jsonBook.colDefs[i].id] = i;
      }

      // embelish 1st cell of each row with some flags
      this.rowUserIdMap = [];
      if (jsonBook.rows)
      {
        for (i = 0, len = jsonBook.rows.length; i < len; i++)
        {
          var c = jsonBook.rows[i][0];
          c.isRowChecked = false;
          c.isHidden = false;
          c.isAvailable = c.avail;
          c.comput_err = false;
          this.rowUserIdMap[c.uid] = i;
        }
      }

      this.customViewMap = [];
      if (jsonBook.customViews)
      {
        for (i = 0; i < jsonBook.customViews.length; i++)
        {
          jsonBook.customViews[i] = new Gradebook.CustomView(jsonBook.customViews[i], this);
          this.customViewMap[jsonBook.customViews[i].id] = i;
        }
      }
      this.groupsMap = [];
      if (jsonBook.groups)
      {
        for (i = 0; i < jsonBook.groups.length; i++)
        {
          this.groupsMap[jsonBook.groups[i].id] = i;
        }
      }
      this._setScoreProviders( jsonBook );
      this.gridColorScheme = jsonBook.colorscheme;
      this._buildCategoryNameMap( jsonBook );
      Object.extend(this, jsonBook); // assign json properties to this object
      this._buildGradingPeriodMap();
      this._setStudentInfoLayout();
      if(!isCachedJsonBook)
      {
        this.setCurrentView(this.initialView);
        this._updateVisibleRows(jsonBook);
        this.sortColumns();
        if (this.colDefMap.LN !== undefined)
        {
          if (this.colDefs[this.colDefMap.LN].gbvis)
          {
            this.sort( this.getSortIndex( 'LN' ), 'ASC', this.getSortIndex( 'FN' ) );
          }
          else
          {
            this.sort( this.getSortIndex( undefined ), 'ASC' );
          }
        }
      }
      else
      {
        // update rows for the hidden property. This is needed in Row Visibility page
        this._updateRows(jsonBook);
      }

      this.lastLogEntryTS = jsonBook.lastLogEntryTS;
      if (!isCachedJsonBook)
      {
        if( !this.usingCachedBook )
        {
          this.initialView = null;
          this.fireModelChanged();
        }
        else
        {
          this.requestUpdateData();
        }
      }
    }
    catch (e2)
    {
      this.fireModelError(e2);
    }
};

Gradebook.GridModel.prototype._setScoreProviders = function( jsonBook )
{
  if ( jsonBook.scoreProviders )
  {
    this.scoreProvidersMap = [];
    this.scoreProviderActionsMap = [];
    this.scoreProvidersHash = jsonBook.scoreProvidersHash;
    var i;
    for ( i = 0; i < jsonBook.scoreProviders.length; i++)
    {
      this.scoreProvidersMap[jsonBook.scoreProviders[i].handle] = jsonBook.scoreProviders[i];
      var actions = jsonBook.scoreProviders[i].actions;
      if (actions)
      {
        for (var j = 0; j < actions.length; j++)
        {
          this.scoreProviderActionsMap[actions[j].id] = actions[j];
          if (actions[j].controlLogic)
          {
              $$('head')[0].appendChild( new Element('script', { type: 'text/javascript', src: actions[j].controlLogic } ) );
          }
        }
      }
    }
    if ( jsonBook.scoreProvidersCurrentUser )
    {
      for ( i = 0; i < jsonBook.scoreProvidersCurrentUser.length; i++)
      {
        var spu = jsonBook.scoreProvidersCurrentUser[ i ];
        if ( spu )
        {
          // statically handled for the time being since it is only a single per-user attribute
          if( this.scoreProvidersMap[ spu.handle ] === null || this.scoreProvidersMap[ spu.handle ] === undefined )
          {
            this.scoreProvidersMap[ spu.handle ] = spu;
          }
          this.scoreProvidersMap[ spu.handle ].allowContentEdit = spu.allowContentEdit?true:false;
        }
      }
    }
  }
};

// callback when updating this gradebook model with server data
Gradebook.GridModel.prototype._updateDataFromJSON = function(reply)
{
  var latestDetalJsonBook;
  try
  {
    if ( typeof ( JSON ) === 'object' && typeof ( JSON.parse ) === 'function' )
    {
      latestDetalJsonBook = JSON.parse( reply.responseText );
    }
    else
    {
      latestDetalJsonBook = eval( '(' + reply.responseText + ')' );
    }
  }
  catch ( e )
  {
    this.fireModelError( e, reply.responseText );
    return;
  }

  // append the new replied json data as the latest delta then
  this._appendJSONDataToModel( latestDetalJsonBook, false );

  // store latestDelta with the previous delta together
  if ( !this.reloadFullJSON )
  {
    this.checkedNoStudents(); // do this last, it will fireModelChanged
    var cachedDeltaJsonBooks = GradebookCache.getObject( GradebookCache.KEY_JSON_DELTA );
    if ( cachedDeltaJsonBooks )
    {
      cachedDeltaJsonBooks.push( latestDetalJsonBook );
      GradebookCache.setObject( GradebookCache.KEY_JSON_DELTA, cachedDeltaJsonBooks );
    }
    else
    {
      GradebookCache.setString( GradebookCache.KEY_JSON_DELTA, '[' + JSON.stringify( latestDetalJsonBook ) + ']' );
    }

    // update info
    GradebookCache.setString( GradebookCache.KEY_VERSION, this.version );
    GradebookCache.setString( GradebookCache.KEY_LAST_USER_CHANGE_TIME, this.lastUserChangeTS );
    GradebookCache.setString( GradebookCache.KEY_USERS_HASH, this.usersHash );
    GradebookCache.setString( GradebookCache.KEY_SCORE_PROVIDER_HASH, this.scoreProvidersHash );
  }
};

Gradebook.GridModel.prototype._appendJSONDataToModel = function(jsonBook, isCachedJsonBook)
{
  try
  {
    // need to reinitialize if new users added to pick up existing grades
    // when a user is re-enabled
    if (this._hasNewUsers(jsonBook) )
    {
      this.reloadFullJSON = true;
      this.requestLoadData( true/*
                                 * force flush since extra users cannot be
                                 * loaded by delta
                                 */);
      return;
    }
    if(!isCachedJsonBook && this.deltaJsonNum && this.deltaJsonNum >= MAX_DELTA_NUM)
    {
      this.reloadFullJSON = true;
      this.requestLoadData( false);
      return;
    }
    this.reloadFullJSON = false;
    this.version = jsonBook.version;
    this.lastUserChangeTS = jsonBook.lastUserChangeTS;
    this.usersHash = jsonBook.usersHash;
    this.numFrozenColumns = jsonBook.numFrozenColumns;
    this.gradingPeriods = jsonBook.gradingPeriods;
    this.categories = jsonBook.categories;
    this._buildCategoryNameMap(jsonBook);
    this.studentInfoLayouts = jsonBook.studentInfoLayouts;
    this.pubColID = jsonBook.pubColID;
    this.defView = jsonBook.defView;

    var i, len;

    this._setScoreProviders( jsonBook );

    if (jsonBook.schemas)
    {
      for (i = 0; i < jsonBook.schemas.length; i++)
      {
        // create a new schema if one with same id does not already exists
        var schema = this.schemaMap[jsonBook.schemas[i].id];
        if (schema === undefined)
        {
          schema = this._createSchema(jsonBook.schemas[i].type, jsonBook.schemas[i]);
          this.schemaMap[jsonBook.schemas[i].id] = schema;
        }
        else
        {
          Object.extend(schema, jsonBook.schemas[i]);
        }
      }
    }
    if (jsonBook.groups)
    {
      if (!this.groupsMap || !this.groups || this.groups.length === 0)
      {
        this.groupsMap =
          [];
        this.groups = jsonBook.groups;
        for (i = 0; i < jsonBook.groups.length; i++)
        {
          this.groupsMap[jsonBook.groups[i].id] = i;
        }
      }
      else
      {
        for (i = 0; i < jsonBook.groups.length; i++)
        {
          var group = this.groupsMap[jsonBook.groups[i].id];
          if (group === undefined)
          {
            this.groupsMap[jsonBook.groups[i].id] = this.groups.length;
            this.groups.push(jsonBook.groups[i]);
          }
          else
          {
            this.groups[group] = jsonBook.groups[i];
          }
        }
      }
    }

    if (jsonBook.colDefs)
    {
      for (i = 0; i < jsonBook.colDefs.length; i++)
      {
        // create a new colDef if one with same id does not already exists
        var colIndex = this.colDefMap[jsonBook.colDefs[i].id];
        if (!colIndex)
        {
          if (jsonBook.colDefs[i].deleted)
          {
            continue;
          }
          this.colDefMap[jsonBook.colDefs[i].id] = this.colDefs.length;
          this.colDefs.push(this._createColDef(jsonBook.colDefs[i], this, this.schemaMap));
        }
        else
        {
          // we should actually discard the previous version and replace it with
          // the new one
          // however all cells hold a ref to the object making this
          // impractical. With incoming
          // refactoring that should not be an issue since col def will
          // always be looked up by
          // cell index in the row - right now only delete the src since it
          // is omitted from payload
          // when absent
          var colDef = this.colDefs[colIndex];
          colDef.comput_err = false;
          if (colDef.src)
          {
            delete colDef.src;
          }
          Object.extend(colDef, jsonBook.colDefs[i]);
          // clear all grades in column if computation error for column
          if (jsonBook.colDefs[i].comput_err)
          {
            var grades = this._getGradesForItemId(jsonBook.colDefs[i].id, true);
            for ( var g = 0; g < grades.length; g++)
            {
              grades[g].initialize(grades[g].colDef, grades[g].metaData);
            }
          }
          if (colDef.deleted)
          {
            this.colDefMap[colDef.id] = null;
          }
          if (colDef.sid)
          {
            colDef.primarySchema = this.schemaMap[colDef.sid];
          }
          if (colDef.ssid && colDef.ssid.length > 0)
          {
            colDef.secondarySchema = this.schemaMap[colDef.ssid];
          }
          else
          {
            colDef.secondarySchema = null;
          }
        }
      }
    }
    // need to add any new row data?
    if (this.rows && this.rows.length > 0)
    {
      var numNewCols = this.colDefs.length - this.rows[0].length;
      if (this.rows.length > 0 && numNewCols > 0)
      {
        for (i = 0; i < this.rows.length; i++)
        {
          for ( var c = 0; c < numNewCols; c++)
          {
            this.rows[i].push(
            {}); // add empty cell for each new column
          }
        }
      }
    }

    var tempArray;

    if (jsonBook.rows)
    {
      // users changed, need to resync
      if (jsonBook.type == "delta_with_user")
      {
        // remove rows from model that are not in json data
        tempArray = [];
        for (i = 0; i < this.rows.length; i++)
        {
          if (this._containsUser(jsonBook.rows, this.rows[i][0].uid))
          {
            tempArray.push(this.rows[i]);
          }
        }
        this.rows = tempArray;
      }
      this.rowUserIdMap = [];
      for (i = 0, len = this.rows.length; i < len; i++)
      {
        this.rowUserIdMap[this.rows[i][0].uid] = i;
      }

      // update rows
      for (i = 0; i < jsonBook.rows.length; i++)
      {
        var row = this.getRowByUserId(jsonBook.rows[i][0].uid);
        if (!row)
        {
          GradebookUtil.error('Can not update non-existing row for user id: ' + jsonBook.rows[i][0].uid);
        }
        else
        {
          this._updateRowDataFromJSON(row, jsonBook.rows[i], this.colDefs, this.colDefMap);
        }
      }
    }
    this._buildGradingPeriodMap();
    if (jsonBook.customViews)
    {
      for (i = 0; i < jsonBook.customViews.length; i++)
      {
        // create a new custom view if one with same id does not already exists
        var idx = this.customViewMap[jsonBook.customViews[i].id];
        if (idx === undefined)
        {
          this.customViewMap[jsonBook.customViews[i].id] = this.customViews.length;
          this.customViews.push(new Gradebook.CustomView(jsonBook.customViews[i], this));
        }
        else
        {
          this.customViews[idx] = new Gradebook.CustomView(jsonBook.customViews[i], this);
        }
      }
    }
    if ( jsonBook.colorscheme )
    {
      this.gridColorScheme = jsonBook.colorscheme;
    }
    // remove any custom views not in customViewIds
    if (this.customViews)
    {
      tempArray = [];
      this.customViewMap = [];
      for (i = 0; i < this.customViews.length; i++)
      {
        // Check for either the id as a number or the raw id - in chrome this is failing for me when I check as a number
        // because it is a string in that array..  checking for either as either match will be a good one and I'm not
        // sure how it would have worked as Number() but do not want to risk removing it or spend the hours required to
        // track down all permutations that may get here that way.
        if (jsonBook.customViewIds.indexOf(Number(this.customViews[i].id)) != -1 ||
            jsonBook.customViewIds.indexOf(this.customViews[i].id) != -1)
        {
          this.customViewMap[this.customViews[i].id] = tempArray.length;
          tempArray.push(this.customViews[i]);
        }
      }
      this.customViews = tempArray;
    }
    this._setStudentInfoLayout();
    if (!isCachedJsonBook && (this.initialView || this.usingCachedBook))
    {
      this.setCurrentView(this.initialView);
      this.initialView = null;
    }
    this.lastLogEntryTS = jsonBook.lastLogEntryTS;

    if (!isCachedJsonBook)
    {
      this._updateVisibleRows(jsonBook);
      this.sortColumns();
      this.reSort();
      this.checkedNoStudents(); // do this last, it will fireModelChanged
    }
    else
    {
      // update rows for the hidden property. This is needed in Row Visibility page
      this._updateRows(jsonBook);
    }
    this.usingCachedBook = false;
  }
  catch (e2)
  {
    this.fireModelError(e2);
  }
};

Gradebook.GridModel.prototype._updateRowDataFromJSON = function(thisRow, jsonRow, colDefs, colDefMap)
{

  for ( var i = 0; i < jsonRow.length; i++)
  {
    var colIndex = colDefMap[jsonRow[i].c];
    if (!colIndex)
    {
      // In an update we might end up switching from a delta to a full pull and the full results
      // may include sparsely populated rows which we have to silently skip over.
      continue;
    }
    var colDef = colDefs[colIndex];
    var currentCell = thisRow[colIndex];
    colDef.comput_err = false;
    // reset any property that is not always part of the cell data
    if (currentCell.nr)
    {
      delete currentCell.nr;
    }
    if (currentCell.mp)
    {
      delete currentCell.mp;
    }
    if (currentCell.x)
    {
      delete currentCell.x;
    }
    if (currentCell.ax)
    {
      delete currentCell.ax;
    }
    if (currentCell.excluded)
    {
      delete currentCell.excluded;
    }
    if (currentCell.numAtt)
    {
      delete currentCell.numAtt;
    }
    if (currentCell.or)
    {
      delete currentCell.or;
    }
    if (currentCell.orBefAtt)
    {
      delete currentCell.orBefAtt;
    }
    if (currentCell.ip)
    {
      delete currentCell.ip;
    }
    if (currentCell.ng)
    {
      delete currentCell.ng;
    }
    if (currentCell.na)
    {
      delete currentCell.na;
    }
    delete currentCell.attemptsInfo;
    Object.extend(currentCell, jsonRow[i]);
  }
  thisRow[0].isAvailable = jsonRow[0].avail;
};

Gradebook.GridModel.prototype._createColDef = function(jsonColDef, model, schemaMap)
{
  if (jsonColDef.type == "s")
  {
    return new Gradebook.StudentAttributeColDef(jsonColDef, model, schemaMap);
  }
  else
  {
    return new Gradebook.GradeColDef(jsonColDef, model, schemaMap);
  }
};

Gradebook.GridModel.prototype._createSchema = function(type, jsonSchema)
{
  if (type == "S")
  {
    return new Gradebook.NumericSchema(jsonSchema, this);
  }
  else if (type == "X")
  {
    return new Gradebook.TextSchema(jsonSchema, this);
  }
  else if (type == "P")
  {
    return new Gradebook.PercentageSchema(jsonSchema, this);
  }
  else if (type == "C")
  {
    return new Gradebook.CompleteIncompleteSchema(jsonSchema, this);
  }
  else if (type == "T")
  {
    return new Gradebook.LetterSchema(jsonSchema, this);
  }
  else
  {
    return null;
  }

};

Gradebook.GridModel.prototype._buildGradingPeriodMap = function()
{
  this.gradingPeriodMap =
    [];
  if (this.gradingPeriods)
  {
    for ( var i = 0, len = this.gradingPeriods.length; i < len; i++)
    {
      this.gradingPeriodMap[this.gradingPeriods[i].id] = this.gradingPeriods[i];
    }
    this.gradingPeriods.sort(function(a, b)
    {
      var aa = a.name.toLowerCase();
      var bb = b.name.toLowerCase();
      if (aa == bb)
      {
        return 0;
      }
      else if (aa < bb)
      {
        return -1;
      }
      else
      {
        return 1;
      }
    });
  }
};

Gradebook.GridModel.prototype._setStudentInfoLayout = function()
{
  // set pos & gbvis for student attribute columns from studentInfoLayouts
  for ( var i = 0; i < this.studentInfoLayouts.length; i++)
  {
    var colIndex = this.colDefMap[this.studentInfoLayouts[i].id];
    if (colIndex === undefined)
    {
      continue;
    }
    var colDef = this.colDefs[colIndex];
    colDef.gbvis = this.studentInfoLayouts[i].gbvis;
    colDef.pos = this.studentInfoLayouts[i].pos;
  }
};

Gradebook.GridModel.prototype._updateVisibleRows = function(jsonBook)
{
  var showAll = (!jsonBook.hiddenStudentIds || jsonBook.hiddenStudentIds.length === 0);
  this.visibleRows =
    [];
  var rows = this.rows;
  // loop through rows and set hidden flag for each row, add to visibleRows
  // if not hidden
  for ( var i = 0, len = rows.length; i < len; i++)
  {
    var row = rows[i];
    var isHidden = !showAll && (jsonBook.hiddenStudentIds.indexOf(row[0].uid) != -1 || jsonBook.hiddenStudentIds.indexOf(Number(row[0].uid)) != -1);
    row[0].isHidden = isHidden;
    if (!isHidden)
    {
      this.visibleRows.push(row);
    }
  }
  this._applyCustomView();

};

// Use for Row Visibility Page
Gradebook.GridModel.prototype._updateRows = function(jsonBook)
{
  var showAll = (!jsonBook.hiddenStudentIds || jsonBook.hiddenStudentIds.length === 0);
  var rows = this.rows;

  for ( var i = 0, len = rows.length; i < len; i++)
  {
    var row = rows[i];
    var isHidden = !showAll && (jsonBook.hiddenStudentIds.indexOf(row[0].uid) != -1 || jsonBook.hiddenStudentIds.indexOf(Number(row[0].uid)) != -1);
    row[0].isHidden = isHidden;
  }
};

Gradebook.GridModel.prototype._buildCategoryNameMap = function(jsonBook)
{
  this.catNameMap =
    [];
  if (jsonBook.categories)
  {
    for ( var i = 0; i < jsonBook.categories.length; i++)
    {
      this.catNameMap[jsonBook.categories[i].id] = jsonBook.categories[i].name;
    }
  }
};

Gradebook.GridModel.prototype._initMessages = function()
{
  if (this.messages)
  {
    return;
  }
  var cachedMessages = GradebookCache.getObject(GradebookCache.KEY_MESSAGES);
  if(cachedMessages)
  {
    this.messages = cachedMessages;
    return;
  }
  this.loadingLocalizedMessages = true;
  this.gradebookService.requestLoadMessages((this._onMessageLoaded).bind(this), (this._reportError).bind(this), (this._reportException).bind(this));
};

Gradebook.GridModel.prototype._onMessageLoaded = function(reply)
{
  var messagesJSON = eval('(' + reply.responseText + ')');
  this.messages = messagesJSON.gradebook2Messages;
  GradebookCache.setObject(GradebookCache.KEY_MESSAGES, this.messages);
  delete this.loadingLocalizedMessages;
};
/**
 * Gradebook data grid
 *
 * PORTIONS OF THIS FILE ARE BASED ON RICO LIVEGRID 1.1.2
 *
 * Copyright 2005 Sabre Airline Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author "Bill Richard"
 * @version
 *
 *
 */

Gradebook.ColDef = Class.create();
Gradebook.ColDef.prototype =
{
  initialize : function(jsonObj, model, schemaMap)
  {
    this.model = model;
    Object.extend(this, jsonObj); // assign json properties to this object
  if (this.sid)
  {
    this.primarySchema = schemaMap[this.sid];
  }
  if (this.ssid)
  {
    this.secondarySchema = schemaMap[this.ssid];
  }
  this.numberOfUniqueAttempts = null;
  this.totalStudentsOrGroups = null;
  this.needsGradingCount = null;
},

/**
 * In the case of headers, the column definition is treated as a cell, so little trick here
 * to have a uniform api: getGridCell().getColumnDefinition() in all cases
 */
getColumnDefinition: function( )
{
  return this;
},

setNumberOfUniqueAttempts : function( uniqueAttempts )
{
  this.numberOfUniqueAttempts = uniqueAttempts;
},

getNumberOfUniqueAttempts : function()
{
  return this.numberOfUniqueAttempts;
},

setTotalStudentsOrGroups : function( rows )
{
  this.totalStudentsOrGroups = rows;
},

getTotalStudentsOrGroups : function()
{
  return this.totalStudentsOrGroups;
},

setNeedsGradingCount : function( count )
{
  this.needsGradingCount = count;
},

getNeedsGradingCount : function()
{
  return this.needsGradingCount;
},

getSortFunction : function( sortdir, secondarySortColumn )
{
  this.secondarySortColumn = secondarySortColumn; // can be null, in that case no second sorting
  if (sortdir == 'ASC')
  {
    return this._sortASC.bind(this);
  } else
  {
    return this._sortDESC.bind(this);
  }
},

validate : function(newValue, matchPartial)
{
  if (!this.primarySchema)
  {
    return null;
  } else
  {
    return this.primarySchema.validate(newValue, matchPartial);
  }
},
_sortASC : function(a, b, isSecondary, fromSortDESC )
{
  isSecondary = isSecondary || ( !this.secondarySortColumn );
  var sortColumnIndex = this.model.colDefMap[ this.id ];
  var aa = a[ sortColumnIndex ].sortval !== undefined?a[ sortColumnIndex ].sortval:a[ sortColumnIndex ].v;
  var bb = b[ sortColumnIndex ].sortval !== undefined?b[ sortColumnIndex ].sortval:b[ sortColumnIndex ].v;

  // Quicksort used in Chrome is not stable (as of May 28, 2012) so we need a measure to prevent random reordering of variables with equal values
  var equalReturnVal;
  if(fromSortDESC)
  {
    equalReturnVal = (a.customSortKey > b.customSortKey ? -1 : 1);
  }
  else
  {
    equalReturnVal = (a.customSortKey > b.customSortKey ? 1 : -1);
  }
  if (!aa && !bb)
  {
    return isSecondary ? equalReturnVal : this.secondarySortColumn._sortASC( a, b, true, fromSortDESC);
  }
  if (!aa)
  {
    return -1;
  }
  if (!bb)
  {
    return 1;
  }
  if ( isNaN( aa ) || isNaN( bb ) )
  {
    aa = ( "" + aa ).toLocaleUpperCase();
    bb = ( "" + bb ).toLocaleUpperCase();
    var stringCompare = aa.localeCompare( bb );
    if ( stringCompare === 0 )
    {
      return isSecondary ? equalReturnVal : this.secondarySortColumn._sortASC( a, b, true, fromSortDESC);
    }
    return stringCompare;
  }
  if (aa == bb)
  {
    return isSecondary ? equalReturnVal : this.secondarySortColumn._sortASC( a, b, true, fromSortDESC);
  }
  if (aa < bb)
  {
    return -1;
  }
  return 1;
},

_sortDESC : function(a, b)
{
  return this._sortASC( b, a, null, true);
},

getEditValue : function(gridCell)
{
  if (!this.primarySchema)
  {
    return gridCell.getValue();
  }
  return this.primarySchema.getEditValue(gridCell);
},

// called by GridCell.getCellValue to get value for rendering in spreadsheet
  // uses primary (and optional secondary) schema to convert value to proper
  // display format
  getCellValue : function(gridCell)
  {
    if (!this.primarySchema)
    {
      return gridCell.getValue();
    }
    var cellVal = this.primarySchema.getCellValue(gridCell);
    if (this.secondarySchema)
    {
      var cellVal2 = this.secondarySchema.getCellValue(gridCell);
      cellVal += '<span dir="ltr">(' + cellVal2 + ')</span>';
    }

    return cellVal;
  },

  // called by GridCell.getAltValue to get alt (mouse over) value for rendering
  // in spreadsheet
  // same as getCellValue unless there is a secondary schema
  getAltValue : function(gridCell)
  {
    if ( gridCell.isAnonymous() )
    {
      return this.model.getMessage('anonymousGradeMsg');
    }
    if (gridCell.isExempt())
    {
      return this.model.getMessage('cmExemptGrade');
    }

    if (!this.primarySchema)
    {
      return this.getCellValue(gridCell);
    }
    var cellVal = this.primarySchema.getAltValue(gridCell);
    if (this.secondarySchema)
    {
      var cellVal2 = this.secondarySchema.getAltValue(gridCell);
      cellVal += ' (' + cellVal2 + ')';
    }
    return cellVal;
  },

  getSortValue : function(gridCell)
  {
    if ( gridCell.data && gridCell.data.sortval !== undefined )
    {
      return gridCell.sortval;
    }
    return gridCell.getValue();
  },

  getName : function()
  {
    return this.name;
  },

  getID : function()
  {
    return this.id;
  },

  getPoints : function()
  {
    return this.points;
  },

  getPointsForDisplay : function()
  {
    var formattedPoints = NumberFormatter.formatPointsTruncate( this.points );
    if (this.isCalculated())
    {
      formattedPoints = GradebookUtil.getMessage( 'variesPerStudentMsg', { points: formattedPoints } );
    }
    return formattedPoints;
  },

  getAliasID : function()
  {
    return this.id;
  },

  getCategoryID : function()
  {
    return this.catid;
  },

  getCategory : function()
  {
    if (!this.catid)
    {
      return "";
    }
    if (!this.model.catNameMap)
    {
      return "";
    }
    var name = this.model.catNameMap[Number(this.catid)];
    if (name)
    {
      return name;
    }
    return "";
  },

  getCategoryAliasID : function()
  {
    return this.catid;
  },

  getGradingPeriodID : function()
  {
    return this.gpid;
  },

  getGradingPeriod : function()
  {
    if (!this.gpid || !this.model.gradingPeriodMap )
    {
      return "";
    }
    var gp = this.model.gradingPeriodMap[Number(this.gpid)];
    if ( gp )
    {
      return gp.name;
    }
    return "";
  },

  isHidden : function()
  {
    return !this.gbvis;
  },

  isScorable : function()
  {
    return this.scrble;
  },

  isPublic : function()
  {
    return (this.id == this.model.pubColID);
  },

  isVisibleToStudents : function()
  {
    return this.vis;
  },

  isAllowUnlimitedAttempts : function()
  {
    return this.isAllowUnlimitedAttempts;
  },
  
  isDelegatedGraded : function()
  {
    return this.isDeleg;
  },

  hideColumn : function()
  {
    this.gbvis = false;
    this.model.hideColumn( this.id );
  },

  canHide : function()
  {
    return true;
  },

  toggleColumnStudentVisibility : function()
  {
    this.model.setColumnStudentVisibility( this.id, !this.vis );
  },

  getDisplayType : function()
  {
    return this.primarySchema.type;
  },

  hasError : function()
  {
    return this.comput_err;
  },

  // called by model.getDisplayValue when external pages need to convert a
  // rawValue
  // This function passes this.points to schema.getDisplayValue.
  // This method should not be called for this colDef if this colDef is a
  // calculated
  // column, because we do not have access to the gridCell to get its max
  // points.
  // todo: determine how to handle error condition if this column is a calulated
  // col
  getDisplayValue : function(rawValue)
  {
    if (this.primarySchema)
    {
      return this.primarySchema.getDisplayValue(rawValue, this.points);
    }
    return rawValue;
  },

  getSecondaryDisplayValue : function(rawValue)
  {
    if (this.secondarySchema)
    {
      return this.secondarySchema.getDisplayValue(rawValue, this.points);
    }
    return;
  }

};

Gradebook.GradeColDef = Class.create();
Object.extend(Gradebook.GradeColDef.prototype, Gradebook.ColDef.prototype);
Object.extend(Gradebook.GradeColDef.prototype,
{
  initialize : function(jsonObj, model, schemaMap)
  {
    this.linkrefid = "";
    Gradebook.ColDef.prototype.initialize.call(this, jsonObj, model, schemaMap);
  },

  getRawValue : function( newValue, isCalculated, pointsPossible )
  {
    var score = newValue;
    // compute score based on primary schema
    if ( this.primarySchema )
    {
      var rawValue = this.primarySchema.getRawValue( newValue, this, isCalculated, pointsPossible );
      score = parseFloat( rawValue );
      if ( !GradebookUtil.isValidFloat( rawValue ) )
      {
        if (typeof ( rawValue ) == "string")
        {
          return rawValue;
        }
        score = 0;
      }
    }
    return score;
  },

  getSortValue : function(gridCell)
  {
    if ( this.primarySchema )
    {
      return this.primarySchema.getSortValue( gridCell );
    }
    else
    {
      return gridCell.getValue();
    }
  },

  updateGrade : function(newValue, userId)
  {
    var score = this.getRawValue(newValue);
    var textValue = newValue;
    this.model.updateGrade(score, textValue, userId, this.id);
  },

  // get the grade for this column in the given row, use shared instance of
  // gridcell A
  // use for sort comparisons only... does not support multiple simultaneous
  // instances
  _getGradeA : function(row)
  {
    if (!this.colIndex)
    {
      this.colIndex = this.model.colDefMap[this.id];
    }
    var data = row[this.colIndex];
    if (!data.metaData)
    {
      data.metaData = row[0];
    }
    if (!data.colDef)
    {
      data.colDef = this;
    }
    var gc = Gradebook.GradeColDef.gridCellA;
    if (!gc)
    {
      Gradebook.GradeColDef.gridCellA = new Gradebook.GridCell();
      gc = Gradebook.GradeColDef.gridCellA;
    }
    gc.setData(data);
    return gc;
  },

  // get the grade for this column in the given row, use shared instance of
  // gridcell B
  // use for sort comparisons only... does not support multiple simultaneous
  // instances
  _getGradeB : function(row)
  {
    if (!this.colIndex)
    {
      this.colIndex = this.model.colDefMap[this.id];
    }
    var data = row[this.colIndex];
    if (!data.metaData)
    {
      data.metaData = row[0];
    }
    if (!data.colDef)
    {
      data.colDef = this;
    }
    var gc = Gradebook.GradeColDef.gridCellB;
    if (!gc)
    {
      Gradebook.GradeColDef.gridCellB = new Gradebook.GridCell();
      gc = Gradebook.GradeColDef.gridCellB;
    }
    gc.setData(data);
    return gc;
  },

  _sortASC : function(a, b, isSecondary )
  {
    // if secondary sort is null, we rely on the JS engine stable sort to derive sub-ordering
    isSecondary = isSecondary || ( !this.secondarySortColumn );
    var gradeA = this._getGradeA(a);
    var gradeB = this._getGradeB(b);
    var aa = gradeA.getSortValue();
    var bb = gradeB.getSortValue();
    if (gradeA.colDef.primarySchema instanceof Gradebook.TextSchema)
    {
      var stringComparaison = aa.localeCompare( bb );
      if ( stringComparaison === 0 )
      {
        return isSecondary?0:this.secondarySortColumn._sortASC(a, b, true);
      }
      return stringComparaison;
    }
    var aaa = parseFloat(aa);
    var bbb = parseFloat(bb);
    var aNull = (aa == '-');
    var bNull = (bb == '-');
    var ax = gradeA.isExempt();
    var bx = gradeB.isExempt();
    var aIP = gradeA.attemptInProgress();
    var bIP = gradeB.attemptInProgress();
    var aNG = gradeA.needsGrading();
    var bNG = gradeB.needsGrading();
    var aOr = gradeA.isOverride();
    var bOr = gradeB.isOverride();
    var aNoScore = (aNull || isNaN(aaa) || ax || ( !aOr && ( aIP || aNG ) ) );
    var bNoScore = (bNull || isNaN(bbb) || bx || ( !bOr && ( bIP || bNG ) ) );
    var aVal = (ax) ? 1 : (aIP) ? 2 : (aNG) ? 3 : (aNull) ? 0 : aa;
    var bVal = (bx) ? 1 : (bIP) ? 2 : (bNG) ? 3 : (bNull) ? 0 : bb;
    if (aNoScore || bNoScore)
    {
      if (aNoScore && bNoScore)
      {
        if (aVal == bVal)
        {
          return isSecondary?0:this.secondarySortColumn._sortASC(a, b, true);
        }
        else
        {
          return aVal - bVal;
        }
      }
      if (aNoScore)
      {
        return -1;
      }
      else
      {
        return 1;
      }
    }
    else
    {
      if (aaa == bbb)
      {
        return isSecondary?0:this.secondarySortColumn._sortASC(a, b, true);
      }
      else
      {
        return aaa - bbb;
      }
    }
  },

  _sortDESC : function(a, b)
  {
    return this._sortASC( b, a );
  },

  isAttemptBased: function()
  {
    var scoreProvider = this.getScoreProvider();
    // default is false unless specified otherwise in the score provider
    return scoreProvider?scoreProvider.attemptBased:false;
  },

  isAllowAttemptGrading: function()
  {
    var scoreProvider = this.getScoreProvider();
    // default is true unless specified otherwise in the score provider
    return scoreProvider?scoreProvider.allowAttempGrading:true;
  },

  /**
   * Used to determine if an attempt is just a grade holder or if it
   * can be expected to actually contain data behind it. That is determined
   * by the score provider being attempt based or not. If no score provider
   * then it is assumed the attempt might contain payload.
   */
  isAttemptWithPayload: function( )
  {
    if ( this.isManual( ) )
    {
      return false;
    }
    var scoreProvider = this.getScoreProvider();
    return scoreProvider?scoreProvider.attemptBased:true;
  },

  isGrade : function()
  {
    return true;
  },

  isCalculated : function()
  {
    return this.type != "N";
  },

  isTotal : function()
  {
    return this.type == "T";
  },

  isWeighted : function()
  {
    return this.type == "W";
  },

  getType : function()
  {
    switch (this.type)
    {
      case "T":
        return 'total';
      case "W":
        return 'weighted';
      case "A":
        return 'average';
      case "M":
        return 'minMax';
    }
    return "grade";
  },

  isManual : function()
  {
    return this.manual;
  },

  isUserCreated : function()
  {
    return this.userCreated;
  },

  isAlignable : function()
  {
    return this.align && this.align == 'y';
  },

  isAttemptAverage : function()
  {
    return this.avg && this.avg == 'y';
  },

  isHideAttemptScore : function()
  {
    return this.hideAtt;
  },

  isTextSchema : function(schemaId)
  {
    var schema = this.model.schemaMap[schemaId];
    if (schema && (schema.type == "X"))
    {
      return true;
    }
    return false;
  },

  isAssessment : function()
  {
    return (this.src && this.src == 'resource/x-bb-assessment');
  },

  isAssignment : function()
  {
    return (this.src && this.src == 'resource/x-bb-assignment');
  },

  hasRubricAssociations : function()
  {
    return (this.hasRubrics && this.hasRubrics == "y");
  },

  getRubricIds : function()
  {
    return this.rubricIds;
  },

  supportsMenuItem : function( menuItemName )
  {
    if ( Object.isUndefined( this.unsupportedActionNames ) )
    {
      return true;
    }
    else
    {
      return !this.unsupportedActionNames.include( menuItemName );
    }
  },

  getScoreProvider : function()
  {
    if (!this.src)
    {
      return "";
    }
    return this.model.scoreProvidersMap[this.src];
  },

  isAllowMulti : function()
  {
    return (this.am && this.am == "y");
  },

  isAllowClearAttempts: function()
  {
    return !(this.nca && this.nca == "y");
  },

  clearAttemptsByDate : function(startDate, endDate)
  {
    this.model.clearAttempts(this.id, 'BYDATE', startDate, endDate);
  },

  clearAttempts : function(option)
  {
    this.model.clearAttempts(this.id, option);
  },

  getFirstUserWithCurrentViewAttempt : function()
  {
    var grades = this.model._getGradesForItemId(this.id, false /* includeUnavailable */);
    var filterType = this.model.getCurrentStatus().toUpperCase();
    if (!filterType)
    {
      filterType = "STAT_ALL";
    }
    if (filterType.startsWith("STAT_"))
    {
      filterType = filterType.substr(5, filterType.length - 5);
    }
    if (filterType == "ALL")
    {
      filterType = "NN"; // we can't grade null grades
    }

    // find first user that has a grade which passes the current filter
    for ( var i = 0; i < grades.length; i++)
    {
      if (grades[i].passesFilter(filterType))
      {
        if (grades[i].isOverride() && !grades[i].hasAttempts())
        {
          continue;
        } else
        {
          return grades[i].getUserId();
        }
      }
    }
    return null;
  },

  _gradeAttempts: function ( hideUserNames ) {
    if ( !this.isDeleg )
    {
      var userId = this.getFirstUserWithCurrentViewAttempt();
      if (userId === null){
        alert(this.model.getMessage('noUsersFoundAlertMsg'));
        return;
      }
    }
    // get attempts for user
    var s = this.model.getCurrentStatus();
    if (s.startsWith("stat_"))
    {
      s = s.substr( 5, status.length - 5 );
    }
    var url = "/webapps/gradebook/do/instructor/getJSONAttemptData?itemId="+this.id+"&course_id="+this.model.courseId+"&status="+s;
    url = url.concat( "&anonymousMode=", hideUserNames ? hideUserNames : "false" );
    this.model.gradebookService.makeAjaxRequest(url, function ( resp ){
      var attempts = resp.responseJSON;
      if (attempts === null || attempts.length === 0){
        alert(this.model.getMessage('noAttemptsFoundAlertMsg'));
        return;
      }
      var groupAttemptId = ( attempts[0].groupAttemptId !== 0 ) ? attempts[0].groupAttemptId : null;
      this.gradeAttempt( attempts[0].uid, attempts[0].aid, hideUserNames, groupAttemptId, null, null, null, null, "columnMenu" );
    }.bind(this));
  },

   gradeAttempt: function ( userId, attemptId, anonymousMode, groupAttemptId, stat, returnUrl, mode, source, sourceDetail ) {

      var url = '/webapps/gradebook/do/instructor/performGrading';

      var status = stat ? stat : this.model.statusFilter;
      if (!status)
      {
        status = "stat_ALL";
      }
      if (status.startsWith("stat_"))
      {
        status = status.substr(5,status.length-5);  // remove starting "stat_"
      }
      var cancelGradeUrl = returnUrl ? returnUrl : '/webapps/gradebook/do/instructor/enterGradeCenter?course_id='+this.model.courseId;

      url = url.concat(
            "?course_id=", this.model.courseId,
            "&status=", status,
            "&viewInfo=", encodeURIComponent( this.model.getCurrentViewName() ),
            "&itemId=", this.id,
            "&category=", encodeURIComponent( this.getCategory() ),
            "&itemName=", encodeURIComponent( this.getName() ),
            "&source=", source ? source : "cp_gradebook",
            "&sourceDetail=", sourceDetail ? sourceDetail : "",
            "&mode=", mode ? mode : "invokeFromGradeCenter",
            "&anonymousMode=", anonymousMode ? anonymousMode : "false",
            "&cancelGradeUrl=", encodeURIComponent( cancelGradeUrl ) );
    if ( this.an === 'n' )
    {
      url += "&courseMembershipId=" + userId;
    }
    if ( groupAttemptId )
    {
      url += "&groupAttemptId=" + groupAttemptId;
    }
    if ( attemptId )
    {
      url += "&attemptId=" + attemptId;
    }

    this.postGradingForm( url );
   },

   /* There has been an occurrence in IE9/IE8 (not in compatibility mode) where the upper frame Element
    * did not seem to have the prototype constructor. This caused the code to choke. The problem seemed
    * to be limited to a hotfix branch, but we'll play it safe and just go the lengthier route of using
    * native DOM methods rather than using 'new gcFrame.Element' in the three instances below.
   */
   postGradingForm: function ( url ) {
      var gcFrame = (top.gradecenterframe) ? top.gradecenterframe : window;
      var gradingForm = document.createElement('form');
      gradingForm.setAttribute('method', 'post');
      gradingForm.setAttribute('action', url);
      gcFrame.document.body.insert({ bottom:gradingForm });
      var vo;
      var visibleUserIds = GradebookCache.getObject(GradebookCache.KEY_VISIBLE_USER_IDS);
      var students = this.model.getStudentsByUserIds( visibleUserIds );
      var retStudents = [];
      for (var i = 0; i < students.length; i++)
      {
        vo = {};
        vo.name = GradebookUtil.formatStudentName( students[i] );
        vo.id = students[i].id;
        retStudents.push( vo );
      }
      var studentsInputElement = gcFrame.document.createElement('input');
      studentsInputElement.setAttribute('type','hidden');
      studentsInputElement.setAttribute('name','students');
      studentsInputElement.setAttribute('value','{"students":'+Object.toJSON(retStudents)+'}');
      gradingForm.insert({bottom:studentsInputElement});
      var items = this.model.getCurrentColDefs();
      var retItems = [];
      for (var j = 0; j < items.length; j++)
      {
          if (!items[j].isAssignment() && !items[j].isAssessment())
          {
            continue;
          }
          var txt = items[j].getName() + ' ('+items[j].getCategory() +')';
        vo = {};
        vo.name = txt;
        vo.id = items[j].getID();
        retItems.push( vo );
      }
      var itemsInputElement =  gcFrame.document.createElement('input');
      itemsInputElement.setAttribute('type','hidden');
      itemsInputElement.setAttribute('name','items');
      itemsInputElement.setAttribute('value','{"items":'+Object.toJSON(retItems)+'}');
      gradingForm.insert({bottom:itemsInputElement});
      gradingForm.submit();
   },

  hasContextMenuInfo : function()
  {
    return true;
  },

  getContextMenuItems : function( cellController )
  {
    var items = [];

    items.push( { key : "cmViewInfoMsg", onclick : cellController.onViewColumnInfo.bindAsEventListener(cellController) } );
    var scoreProvider = this.getScoreProvider();
    //TODO: Determine what allows you to see this
    if ( !this.isCalculated() && this.model.getUserCanPerformAllGradingActions() )
    {
      items.push( { key : "cmSendReminderMsg", onclick : this.onSendReminder.bindAsEventListener(this) } );
    }
    if (scoreProvider && scoreProvider.allowContentEdit )
    {
      var msg = page.bundle.getString( "cmModifyContentMsg", scoreProvider.typeName );
      items.push( { name : msg, onclick : this.onEditContent.bindAsEventListener(this) } );
    }

    if (this.model.allowedModifyDueDate && this.type === 'N') {
      var modifyDueDateUrl = '/webapps/gradebook/do/instructor/modifyItemDueDate?course_id=' + this.model.courseId +
        '&id=' + this.id + '&returnUrl=' + encodeURI(window.location.href);
      items.push( { key: "cmModifyDueDate", onclick: this.gotoUrl.bind(this, modifyDueDateUrl) } );
    }

    if (this.isAlignable() && window.bbalign )
    {
      items.push( { key : "cmViewAlignmentsMsg", onclick : this.onShowAlignments.bindAsEventListener(this) } );
    }

    GradebookUtil.appendSeperator( items );

    if (scoreProvider && scoreProvider.attemptBased )
    {
      if ( this.supportsMenuItem( "cmGradeAttempts" ) && this.model.getUserCanEnterAttemptGrades() )
      {
        items.push( { key : "cmGradeAttempts", onclick : this.onGradeAttempts.bindAsEventListener(this) } );
      }

      if ( this.supportsMenuItem( "cmGradeWithUserNamesHidden" ) && this.model.getUserCanEnterAttemptGrades()  )
      {
        items.push( { key : "cmGradeWithUserNamesHidden", onclick : this.onGradeWithUserNamesHidden.bindAsEventListener(this) } );
      }
    }

    if( this.isDeleg && this.userCanReconcile )
    {
      items.push( { key : "cmViewReconcileMsg", onclick : this.onGradeReconcile.bindAsEventListener(this) } );
    }

    var url;
    var i;
    var actions = scoreProvider ? scoreProvider.actions : null;
    if (actions)
    {
      for (i = 0; i < actions.length; i++)
      {
        var action = actions[i];
        if (action.controller && action.controller.isEnabled( this ) === false)
        {
          continue;
        }
        if ( this.supportsMenuItem( action.internalName ) )
        {
          url = action.actionUrl + "?outcome_definition_id=" + this.id + "&course_id=" + this.model.courseId;
          items.push( { name : action.name, onclick : this.gotoUrl.bind(this, url) } );
        }
      }
    }
    if (this.hasRubricAssociations())
    {
      var rubricIds = this.getRubricIds();
      for (i=0; i< rubricIds.length; i++)
      {
        url = "/webapps/blackboard/execute/reporting/runReport?hideList=true&report_def_id=@X@reportDefinition.id@X@&nav_bridge=cp_gradebook2_rubric_associations_report&report_type=learn.course.gradecenter.column.stats&course_id=" +
          this.model.courseId + "&gradebook_main_pk1=_" + this.id + "_1&rubric_id=" + rubricIds[i].id + "&qti_asi_data_pk1=";
        items.push( { name : rubricIds[i].name, onclick : this.gotoUrl.bind(this, url) } );
      }
    }

    if ( !this.isCalculated() && cellController.grid.options.gradeHistoryEnabled )
    {
      items.push( { key: "cmGradeHistory", onclick: this.onShowGradeHistory.bindAsEventListener( this ) } );
    }
    GradebookUtil.appendSeperator( items );

    if (this.model.getUserHasFullGradebookAccess()) {
      items.push( { key : "cmModifyMsg", onclick : this.onModifyColumn.bindAsEventListener(this) } );
    }

    if ( !this.isTextSchema(this.sid) && this.model.getUserCanViewGradebookGrades() )
    {
      items.push( { key : "cmColumnStatsMsg", onclick : this.onItemStats.bindAsEventListener(this) } );
    }
    if (this.model.getUserHasFullGradebookAccess())
    {
      if (!this.isPublic())
      {
        items.push( { key : "cmMakeExternalGradeMsg", onclick : this.onMakeExternalGrade.bindAsEventListener(this) } );
      }
      if (!this.isPublic())
      {
        items.push( { key : "cmStudentAvailableMsg", onclick : this.onToggleColumnStudentVisibility.bindAsEventListener(this) } );
      }
    }

    GradebookUtil.appendSeperator( items );

    // TODO: Implement Attempt permissions check
    if ( this.isAllowMulti() && this.isAllowClearAttempts() && this.model.getUserCanPerformAllGradingActions() )
    {
      items.push( { key : "cmClearAllAttemptsMsg", onclick : cellController.onShowClearAttemptsForm.bindAsEventListener(cellController) } );
    }

    GradebookUtil.appendSeperator( items );

    items.push( { key : "cmSortAscendingMsg", onclick : cellController.onSortAscending.bindAsEventListener(cellController) } );
    items.push( { key : "cmSortDescendingMsg", onclick : cellController.onSortDescending.bindAsEventListener(cellController) } );
    if (this.model.getUserHasFullGradebookAccess())
    {
      items.push( { key : "cmHideItemMsg", onclick : this.hideColumn.bindAsEventListener(this) } );
    }

    if ((this.isManual() || this.isCalculated()) && !this.isPublic() && this.model.getUserHasFullGradebookAccess())
    {
      items.push( { key : "cmDeleteItemMsg", onclick : this.onDeleteColumn.bindAsEventListener(this) } );
    }

    return items;
  },
  
  onSendReminder: function( )
  {
    var courseId = parseInt(this.model.gradebookService.getCourseId(), 10);
    var itemId = parseInt( this.id, 10);
		
    GradebookDWRFacade.getNumNonSubmitters( courseId, itemId , function( retStatus ) {
      if ( retStatus.numNonSubmitters === undefined || retStatus.numNonSubmitters === undefined ) {
        new page.InlineConfirmation( "error", page.bundle.getString("sendReminderErrorMsg"), false, true );
      }
      else if ( retStatus.numNonSubmitters === 0 ) {
        new page.InlineConfirmation( "success", page.bundle.getString("sendReminderNoStudentsMsg"), false, true );
      }
      else if ( confirm( this._getReminderConfirmMsg(retStatus.numNonSubmitters) ) ) {        
        GradebookDWRFacade.sendReminder( courseId, itemId , function( retStatus ) {
          new page.InlineConfirmation( "success", this._getReminderSuccessMsg(retStatus.numNonSubmitters), false, true );
        }.bind(this));
      }
    }.bind(this));
  },

  _getReminderConfirmMsg: function( numNonSubmitters )
  {
    if ( numNonSubmitters === 1 ) {
      return page.bundle.getString("sendReminderSingleConfirmMsg");
    } else {
      return page.bundle.getString("sendReminderConfirmMsg",numNonSubmitters);
    }
  },

  _getReminderSuccessMsg: function( numNonSubmitters )
  {
    if ( numNonSubmitters === 1 ) {
      return page.bundle.getString("sendReminderSingleSuccessMsg");
    } else {
      return page.bundle.getString("sendReminderSuccessMsg",numNonSubmitters);
    }
  },

  onEditContent: function( )
  {
    this.gotoUrl( this.model.gradebookService.editContentURL + "&itemId=" + this.id );
  },

  onShowAlignments: function()
  {
    if ( window.bbalign )
    {
      window.bbalign.showLightbox( 'blackboard.platform.gradebook2.GradableItem;_'+ this.id + '_1', this.name.unescapeHTML(), window.courseID );
    }
  },

  onItemStats : function()
  {
    this.model.viewItemStats( this.id );
  },

  onGradeWithUserNamesHidden : function()
  {
    this._gradeAttempts( true );
  },

  onGradeAttempts : function()
  {
    this._gradeAttempts( false );
  },

  onGradeReconcile : function()
  {
    this.model.reconcileGrades( this.id, this.type );
  },

  onModifyColumn : function()
  {
    this.model.modifyColumn( this.id, this.type );
  },

  onShowGradeHistory: function()
  {
    this.gotoUrl( "/webapps/gradebook/do/instructor/getGradeHistory?course_id=" + this.model.courseId + "&itemId=" + this.id );
  },

  onToggleColumnStudentVisibility : function()
  {
    this.toggleColumnStudentVisibility( this.id, !this.vis );
    Gradebook.CellController.prototype.closePopupsAndRestoreFocus();
  },

  onMakeExternalGrade : function()
  {
    this.model.gradebookService.makeExternalGrade( this.id );
    Gradebook.CellController.prototype.closePopupsAndRestoreFocus();
  },

  onDeleteColumn : function()
  {
    if ( confirm( this.model.getMessage('confirmDeleteItemMsg') ) )
    {
      this.model.deleteColumn( this.id );
    }
  },

  gotoUrl : function( url )
  {
    window.location.href = url;
  },

  getDueDate : function()
  {
    var dueDate = GradebookUtil.getMessage('noneMsg');
    //ldue is the date localized in server
    if ( this.ldue && this.ldue !== 0 )
    {
      dueDate = this.ldue;
    }
    return dueDate;
  },

  // called by item stats page
  getStats : function(includeUnavailableStudents)
  {

    var grades = this.model._getGradesForItemId(this.id, includeUnavailableStudents);
    if (this.primarySchema instanceof Gradebook.TextSchema)
    {
      grades = [];
    }

    var values = [];
    var sum = 0;
    var stats = {};
    stats.count = 0;
    stats.minVal = null;
    stats.maxVal = null;
    stats.qtyNull = 0;
    stats.qtyInProgress = 0;
    stats.qtyNeedsGrading = 0;
    stats.qtyExempt = 0;

    for ( var i = 0; i < grades.length; i++)
    {
      var grade = grades[i];
      if (grade.isExcluded())
      {
        continue;
      }
      var val = grade.getValue();
      var isNull = (val == '-' || val === '' || null === val );
      var isIP = grade.attemptInProgress();
      var isNG = grade.needsGrading();
      var isExempt = grade.isExempt();
      var isVal = (!isNull && !isExempt);
      if (!grade.isOverride() && isIP)
      {
        // non-manually graded, in progress attempts are excluded from the statistics
        isVal = false;
      }

      if (isIP)
      {
        stats.qtyInProgress++;
      }
      else if (isNG)
      {
        stats.qtyNeedsGrading++;
      }
      else if (isExempt)
      {
        stats.qtyExempt++;
      }
      else if (isNull)
      {
        stats.qtyNull++;
      }

      if (isVal)
      {
        if (this.isCalculated())
        {
          val = (parseFloat(val) / parseFloat( grade.getPointsPossible() ) * 100.0);
        }
        values.push(val);
        sum += parseFloat(val);
        stats.minVal = ( null === stats.minVal ) ? val : Math.min(val, stats.minVal);
        stats.maxVal = ( null === stats.maxVal ) ? val : Math.max(val, stats.maxVal);
      }
    }
    stats.count = values.length;

    if (values.length === 0 || this.isHideAttemptScore())
    {
      stats.avg = '';
      stats.range = '';
      stats.minVal = '';
      stats.maxVal = '';
      stats.median = '';
      stats.variance = '';
      stats.stdDev = '';
    }
    else
    {
      stats.avg = sum / values.length;
      stats.range = stats.maxVal - stats.minVal;

      values.sort(Gradebook.numberComparator);
      if (values.length == 1)
      {
        stats.median = values[0];
      }
      else if (values.length % 2)
      {
        // number of values is odd, the median is the middle value
        stats.median = values[parseInt(values.length / 2, 10)];
      }
      else
      {
        // number of values is even, the median is the average of the two middle
        // values
        stats.median = (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
      }
      stats.variance = this._computeVariance(values, stats.avg);
      stats.stdDev = Math.sqrt(stats.variance);
      stats.maxVal = this._formatFloat(stats.maxVal);
      stats.minVal = this._formatFloat(stats.minVal);
      stats.avg = this._formatFloat(stats.avg);
      stats.range = this._formatFloat(stats.range);
      stats.median = this._formatFloat(stats.median);
      stats.variance = this._formatFloat(stats.variance);
      stats.stdDev = this._formatFloat(stats.stdDev);
      // If the column is calculated all the numbers that have been worked out are based off the grade value / points possible * 100
      // As such they need to indicate this by appending the percentage sign to the string for avg, minVal, maxVal, median.
      // range, variance and standard deviation should not be percentages as they mean something entirely different:
      // IE: range: relative percent range
      if (this.isCalculated())
      {
        stats.avg += '%';
        stats.minVal += '%';
        stats.maxVal += '%';
        stats.median += '%';
      }
    }

    stats.gradeDistribution = this.primarySchema.getGradeDistribution(values, this.isCalculated() ? 100 : this.points, stats);
    return stats;
  },

  _formatFloat : function(f)
  {
    try
    {
      if (f || f === 0) // Format the number 0 too
      {
        return NumberFormatter.formatScoreTruncate( f );
      }
    }
    catch (e)
    {
      // ignore and return the current value
    }
    return f;
  },

  _computeVariance : function(values, average)
  {
    var sumXMeanSquare = 0;
    for ( var i = 0; i < values.length; i++)
    {
      var xMean = values[i] - average;
      sumXMeanSquare += (xMean * xMean);
    }
    return sumXMeanSquare / values.length;
  },

  getInfo : function()
  {
    var publicLabel;
    if (this.isPublic())
    {
      publicLabel = GradebookUtil.getMessage('isMsg');
    }
    else
    {
      publicLabel = GradebookUtil.getMessage('isNotMsg');
    }
    var includedInCalculationsLabel;
    if (this.isScorable())
    {
      includedInCalculationsLabel = GradebookUtil.getMessage('yesMsg');
    }
    else
    {
      includedInCalculationsLabel = GradebookUtil.getMessage('noMsg');
    }
    var points = this.getPointsForDisplay();
    var info = {};
    info.itemInfoId = this.getID();
    info.itemInfoName = this.name;
    info.itemInfoCategory = this.getCategory();
    info.itemInfoSchema = this.primarySchema.name;
    info.itemInfoPoints = (points === 0 ? "-" : points);
    info.itemInfoPublic = publicLabel;
    info.itemInfoIncludedInCalculations = includedInCalculationsLabel;
    info.itemInfoDueDate = this.getDueDate();
    return info;
  }
});

Gradebook.StudentAttributeColDef = Class.create();

Object.extend(Gradebook.StudentAttributeColDef.prototype, Gradebook.ColDef.prototype);

Object.extend(Gradebook.StudentAttributeColDef.prototype,
{
  initialize : function(jsonObj, model, schemaMap)
  {
    Gradebook.ColDef.prototype.initialize.call(this, jsonObj, model, schemaMap);
    this.vis = true;
  },

  isGrade : function()
  {
    return false;
  },

  isCalculated : function()
  {
    return false;
  },
  isTotal : function()
  {
    return false;
  },

  isWeighted : function()
  {
    return false;
  },

  getType : function()
  {
    return "student";
  },

  getCellValue : function(gridCell)
  {
    return gridCell.getValue();
  },

  getRawValue : function(newValue)
  {
    return newValue;
  },

  canHide : function()
  {
    return (this.model.colOrderMap[0] != this.model.colDefMap[this.id]);
  },

  hasContextMenuInfo : function()
  {
    return true;
  },

  getContextMenuItems : function( cellController )
  {
    var items = [];
    items.push( { key : "cmSortAscendingMsg", onclick : cellController.onSortAscending.bindAsEventListener(cellController) } );
    items.push( { key : "cmSortDescendingMsg", onclick : cellController.onSortDescending.bindAsEventListener(cellController) } );
    if ( this.canHide() && this.model.getUserHasFullGradebookAccess() )
    {
      items.push( { key : "cmHideItemMsg", onclick : this.hideColumn.bindAsEventListener(this) } );
    }
    return items;
  }


});
/*

  GridCell class wraps and provides functionality to a data cell in the grade center.

  Each HTML cell controller will contain a GridCell to allow manipulating the data cell
  that is currently assigned to it.
  When data cells are retrieved for processing they are wrapped in a GridCell.

  brichard
*/


Gradebook.GridCell = Class.create();

Gradebook.GridCell.prototype =
{
  initialize : function(data)
  {
    if (data)
    {
      this.setData(data);
    }
  },

  setData : function(data)
  {
    this.data = data;
    this.colDef = data.colDef;
    this.metaData = data.metaData;
    if (this.colDef.id == 'UN')
    {
      this.metaData.userNameDataCell = data;
    }
  },

  passesFilter : function(f)
  {
    var ng = this.needsGrading();
    var ip = this.attemptInProgress();
    var or = this.isOverride();
    var x = this.isExempt();
    var an = this.isAnonymous();
    var sv = this.getValue(this);
    var svn = sv == '-';
    var svnn = sv != '-';
    var na = svn && !ip && !ng && !this.colDef.isCalculated() && !this.isExcluded();
    var c = !ip && !ng && !x && svnn;
    var nn = ip || ng || or || svnn || an;
    if (f == 'IP')
    {
      return ip;
    }
    else if (f == 'NG')
    {
      return ng && !or;
    }
    else if (f == 'EM')
    {
      return or;
    }
    else if (f == 'X')
    {
      return x;
    }
    else if (f == "NA")
    {
      return na; // notAttempted
    }
    else if (f == "NN")
    {
      return nn; // not null
    }
    else if (f == "C")
    {
      return c || or; // completed/graded
    }
    else
    {
      return true; // all
    }
  },

  getUserId : function()
  {
    return this.metaData.uid;
  },

  getInstitutionUserId : function( )
  {
    return this.metaData.iuid;
  },

  getKey : function()
  {
    return this.colDef.id + '_' + this.metaData.uid;
  },

  getUserName : function()
  {
    return this.metaData.userNameDataCell.v;
  },

  isHidden : function()
  {
    return this.metaData.isHidden;
  },

  setHidden : function(h)
  {
    this.metaData.isHidden = h;
  },

  isRowChecked : function()
  {
    return this.metaData.isRowChecked;
  },

  canAddComment : function()
  {
    if ( this.colDef.isDelegatedGraded() && !this.colDef.userCanReconcile )
    {
      return false;
    }

    // Can add comments for: overridden, exempted, or graded cells, with the appropriate entitlements.
    var userCanEnterGradingFeedback = this.colDef.model.getUserCanEnterGradingFeedback();
    if ( this.isOverride() )
    {
      return userCanEnterGradingFeedback || this.colDef.model.getUserCanOverrideGrades();
    }
    else if ( this.isExempt() )
    {
      return userCanEnterGradingFeedback;
    }
    else if ( this.isPersisted() && !this.needsGrading() && !this.attemptInProgress() && this.isGraded() && !this.colDef.isAttemptAverage() )
    {
      return userCanEnterGradingFeedback || this.colDef.model.getUserCanEnterAttemptGrades();
    }

    return false;
  },

  isActivity : function()
  {
    return this.colDef.src && !this.colDef.getScoreProvider().attemptBased;
  },
  
  isAssignment : function()
  {
    return this.colDef.src && this.colDef.isAssignment();	
  },
  
  hasGradableAttempts : function()
  {
    return (!this.isActivity() && (this.colDef.src || this.colDef.extAttemptHandler) &&
        (this.hasAttempts() || this.data.ax /* has exempted attempt */));
  },

  isReconciled : function()
  {
    return (this.data.reconciled && this.data.reconciled == "y");
  },

  isExcluded : function()
  {
    return this.data.excluded || (this.colDef.limitedAttendance && !this.isPersisted());
  },

  isAllowUnlimitedAttempts : function()
  {
    return this.colDef.isAllowUnlimitedAttempts;
  },
  
  isAnonymous : function()
  {
    return ( this.colDef.an && this.colDef.an === "y" );
  },

  isPersisted : function()
  {
    return ("v" in this.data);
  },

  setRowChecked : function(c)
  {
    this.metaData.isRowChecked = c;
    this.colDef.model.fireModelChanged(); // updates the counter on the grid
  },

  isAvailable : function()
  {
    return this.metaData.isAvailable;
  },

  isGrade : function()
  {
    return (this.colDef.isGrade());
  },

  isOverride : function()
  {
    return (this.data.or && this.data.or == "y" && !this.colDef.isCalculated());
  },

  /*
   * Did the override occurred before the attempt creation? If so
   * we will show the needs grading icon.
   */
  isOverrideBeforeNeedsGrading: function()
  {
    return ( this.data.orBefAtt && this.data.orBefAtt == "y" );
  },

  needsGrading : function()
  {
    return ( this.data.ng && this.data.ng == "y");
  },

  needsReconcile : function()
  {
    return ( this.data.nr && this.data.nr == "y");
  },

  canGrade : function()
  {
    return (! (this.data.cg && this.data.cg == "n") );
  },

  attemptInProgress : function()
  {
    return ( this.data.ip && this.data.ip == "y");
  },

  isGraded : function()
  {
    var tv = this.getTextValue();
    return (tv != '-' && tv.length > 0);
  },

  isComplete : function()
  {
    if (this.colDef.primarySchema instanceof Gradebook.CompleteIncompleteSchema)
    {
      return this.isGraded();
    }
    else
    {
      return false;
    }
  },

  isExempt : function()
  {
    return (this.data.x && this.data.x == "y");
  },

  hasMultipleAttempts : function()
  {
    return (this.data.numAtt && this.data.numAtt == "M");
  },

  hasOneAttempt : function()
  {
    return (!this.data.numAtt || this.data.numAtt == "1");
  },

  hasAttempts : function()
  {
    return this.hasOneAttempt() || this.hasMultipleAttempts();
  },

  isScoreEntryDesignation : function( scoreDesignation )
  {
    // First see if we have a score designation for this grade value
    // (assuming there is an existing grade or attempt for this item)
    if ('sd' in this.data)
    {
      return this.data.sd === scoreDesignation;
    }
    // Otherwise see if we have a score designation for the column itself
    else if ('sd' in this.colDef)
    {
      return this.colDef.sd === scoreDesignation;
    }
    return false;
  },

  // Whether a score entered in the grid for this cell would be an attempt score,
  // including whether the current user is entitled to enter attempt grades
  scoreEntryDesignationIsAttempt : function()
  {
    return this.isScoreEntryDesignation( GradeScoreDesignation.AttemptScore );
  },

  // Whether a score entered in the grid for this cell would be an override score,
  // including whether the current user is entitled to enter override grades
  scoreEntryDesignationIsOverride : function()
  {
    return this.isScoreEntryDesignation( GradeScoreDesignation.OverrideScore );
  },

  // Score designation for this cell is unknown or the user is not entitled to enter
  // a score of the appropriate type. Disallow cell edit in this case.
  scoreEntryDesignationIsNone : function()
  {
    return !this.scoreEntryDesignationIsAttempt() && !this.scoreEntryDesignationIsOverride();
  },

  validate : function(newValue, matchPartial)
  {
    return this.colDef.validate(newValue, matchPartial);
  },

  getColumnDefinition: function( )
  {
    return this.colDef;
  },

  update : function(newValue)
  {
    this.colDef.updateGrade(newValue, this.getUserId());
  },

  clearAll : function(isDelete)
  {
    this.colDef.model.clearAll(isDelete, this.getUserId(), this.colDef.id);
  },

  clearSelected : function(attemptIds, isDelete)
  {
    this.colDef.model.clearSelected(attemptIds, isDelete, this.getUserId(), this.colDef.id);
  },

  // called by CellController.renderHTML to get value for spreadsheet
  getCellValue : function()
  {
    return this.colDef.getCellValue(this);
  },

  // called by GridCell.getAltValue to get alt (mouse over) value for rendering
  // in spreadsheet
  getAltValue : function()
  {
    if ( this.isAnonymous() ){
      return GradebookUtil.getMessage('anonymousGradeMsg');
    }
    else if (this.isGrade() && !this.isGraded())
    {
      return GradebookUtil.getMessage('noGradeMsg');
    }
    return this.colDef.getAltValue(this);
  },

  // called by CellController.startEdit to get input value for editing
  getEditValue : function()
  {
    if ( !this.isGraded() )
    {
      return "";
    }
    return this.colDef.getEditValue(this);
  },

  getSortValue : function()
  {
    return this.colDef.getSortValue(this);
  },

  getNormalizedValue: function()
  {
    if ( this.data.v !== undefined && this.data.v !== null  && this.getPointsPossible() )
    {
      return this.data.v / this.getPointsPossible();
    }
    return NaN;
  },

  getPointsPossible : function()
  {
    if (this.data.mp)
    {
      return this.data.mp;
    }
    else if (this.colDef.points)
    {
      return this.colDef.points;
    }
    else
    {
      return 0;
    }
  },

  getTextValue : function()
  {
    if (this.data.tv)
    {
      return this.data.tv;
    }
    else
    {
      return '-';
    }
  },

  getValue : function()
  {
    // do not use if ( this.data.v ) since it will prevent 0 to display properly
    if ( this.data.v !== undefined && this.data.v !== null )
    {
      return this.data.v;
    }
    else
    {
      return '-';
    }
  },

  getNormalizedGrade: function()
  {
    if (this.data.v !== undefined && this.data.v !== null)
    {
      var pointsPossible = this.getPointsPossible();
      if ( pointsPossible > 0 )
      {
        return this.data.v / pointsPossible;
      }
    }
    return null;
  },

  canEdit : function()
  {
    var isEditable = this.isGrade() && !this.isExcluded() && !this.colDef.isCalculated() && !this.colDef.isHideAttemptScore();
    if ( !isEditable )
    {
      return false;
    }
    if ( !this.colDef.isDeleg )
    {
      return this.scoreEntryDesignationIsAttempt() || this.scoreEntryDesignationIsOverride();
    }
    //Per LRN-85559, allow the instructor manually enter grade only if the student has not submitted the assignment yet or the submission has reconciled grade.
    if ( this.isReconciled() && !this.needsReconcile() || !this.data.numAtt || this.data.numAtt == "0")
    {
      return this.colDef.userCanReconcile;
    }
    else
    {
      return false;  // Even if the user can grade (this.canGrade() == true) we want to disable All editing in the grid for delegated, not-reconciled items
    }
  },

  loadAttemptsInfo : function(callbackFunction)
  {
    var currentCell = this;
    this.colDef.model.gradebookService.loadAttemptsInfo(this.getUserId(), this.colDef.id, function(attempts)
    {
      currentCell.loadAttemptsInfoCallback.call(currentCell, attempts, callbackFunction);
    });
  },

  loadAttemptsInfoCallback : function(attempts, callbackFunction)
  {
    this.data.attemptsInfo =
      [];
    for ( var i = 0; i < attempts.length; ++i)
    {
      this.data.attemptsInfo.push(new Gradebook.AttemptInfo(this, attempts[i]));
    }
    callbackFunction(this);
  },

  getMenuDynItems : function()
  {
    var dynItems = [];
    var gradeCell = this;
    for ( var i = 0; i < this.data.attemptsInfo.length; ++i)
    {
      var attemptId = gradeCell.data.attemptsInfo[i].id;
      var groupAttemptId = gradeCell.data.attemptsInfo[i].groupAttemptId;
      // note that we cannot create a function as a direct closure here
      // since it would rely on this function scope which actually changes
      // as we iterate i.e. all functions will point to the same scope which
      // ends
      // up being the scope as at the last iteration.
      // To 'freeze' the scope we create a new local scope calling another
      // function using current parameters.
      //Don't display the 'not_attempted' attempts
      var attemptInfo = this.data.attemptsInfo[ i ];
      if ( attemptInfo.status != "na" && (attemptInfo.countsTowardGrade || window.model.showNonCountingAttempts ) )
      {
        dynItems.push(
        {
          id : "attemptDynItem",
          title : "",
          name : attemptInfo.getText(),
          onclick : this.getGotoAttemptFunction( attemptId, groupAttemptId )
        } );

        dynItems[dynItems.length-1].title = this.removeMarkup(dynItems[dynItems.length-1].name);
      }
    }

    return dynItems;
  },

  removeMarkup : function (text)
  {
    while ( text.indexOf( "<" ) > -1 )
    {
      text = text.substr( 0, text.indexOf( '<' ) ) + text.substr( text.indexOf( '>') + 1 );
    }

    return text;
  },

  getGotoAttemptFunction : function(attemptId, groupAttemptId)
  {
    var gradeCell = this;
    var currentAttemptId = attemptId;
    var currentGroupAttemptId = groupAttemptId;
    return function()
    {
      gradeCell.gotoAttempt.call(gradeCell, attemptId, groupAttemptId);
    };
  },

  gotoAttempt : function(attemptId, groupAttemptId)
  {
    if (this.colDef.groupActivity && !groupAttemptId && this.showGradeDetails !== undefined)
    {
      this.showGradeDetails();
      return;
    }

    this.colDef.gradeAttempt( this.getUserId(), attemptId, false, groupAttemptId );
  },

  gotoActivity : function()
  {
    this.gotoAttempt();
  },

  hasContextMenuInfo : function(cellController)
  {
    if (this.isGrade())
    {
      //Allow the context menu for anonymous items if there is not unlimited attempts allowed.
      var contextMenuIsAvailable = (this.isAnonymous() ? (this.isAssignment() && !this.isAllowUnlimitedAttempts()) : true);
      return !this.isExcluded() && !this.colDef.isCalculated() && contextMenuIsAvailable;
    }
    else
    {
      return true;
    }
  },

  getContextMenuItems : function( cellController )
  {
    if (this.isGrade())
    {
      return this.getGradeContextMenuItems( cellController );
    }
    else
    {
      return this.getStudentContextMenuItems( cellController );
    }
  },

  getGradeContextMenuItems : function( cellController )
  {
    if (this.isExcluded() || this.colDef.isCalculated())
    {
      return null;
    }

    var items = [];

    // LRN-80097 as of release 9.1.201404 the spec for DG:US:7.2 states that Grade Details page can always be accessed
    // regardless of whether the submission was delegated to the grader or not, so just add the menu item (if the user can view grades)
    if ( this.colDef.model.getUserCanViewGradebookGrades() )
    {
      items.push( { key : "cmGrade360Msg", onclick : cellController.onShowGradeDetails.bindAsEventListener(cellController) } );
    }

    
    if ( this.isAnonymous() )
      {
      if (items.length > 0)
      {
        return items;
      }
      return null;
    }
    
    if ( this.canAddComment() )
    {
      // onAddComment will set focus so we do not want the context menu framework to do it onClick
      items.push( { key : "cmAddCommentMsg", onclick : cellController.onAddComment.bindAsEventListener(cellController), doNotSetFocusOnClick : true } );
    }

    GradebookUtil.appendSeperator(items);

    if ( (!this.colDef.isDeleg || this.colDef.userCanReconcile) && this.colDef.model.getUserCanPerformAllGradingActions() )
    {
      if ( !this.isExempt() )
      {
        items.push( { key : "cmExemptGrade", onclick : cellController.onExemptGrade.bindAsEventListener(cellController) } );
      }
      else
      {
        items.push( { key : "cmClearExemption", onclick : cellController.onClearExemption.bindAsEventListener(cellController) } );
      }
    }

    GradebookUtil.appendSeperator(items);

    if ( this.isActivity() )
    {
      var item = { onclick: this.gotoActivity.bindAsEventListener( this ) };
      if ( this.colDef.model.getUserCanEnterAttemptGrades() )
      {
        item.key = "cmGradeStudentActivityMsg";
        items.push( item );
      }
      else if ( this.colDef.model.getUserCanViewGradebookAttempts() )
      {
        item.key = "cmViewStudentActivityMsg";
        items.push( item );
      }
    }

    if ( this.hasGradableAttempts() && this.colDef.model.getUserCanViewGradebookAttempts() )
    {
      this.cellController = cellController;
      this.loadAttemptsInfo( function(){
          this.cellController.contextMenuController.appendItems( this.getMenuDynItems() );
        }.bind(this));
    }

    if (items.length > 0)
    {
      return items;
    }

    return null;
  },

  getStudentContextMenuItems : function( cellController )
  {
    var items = [];

    if ( this.colDef.model.isolatedStudentId )
    {
      items.push( { key : "cmRestoreFromSingleStudentView", onclick : this.onShowAllRows.bindAsEventListener(this) } );
    }
    else if ( this.colDef.model.getUserHasFullGradebookAccess() )
    {
      items.push( { key : "cmStudentHideOtherStudentsMsg", onclick : this.onHideOtherStudents.bindAsEventListener(this) } );
    }

    if ( this.colDef.model.getUserCanViewGradebookGrades() )
    {
      items.push( { key : "cmStudentStatsMsg", onclick : this.onStudentStats.bindAsEventListener(this) } );
    }
    items.push( { key : "cmStudentAdapRelMsg", onclick : this.onAdaptiveReleaseUser.bindAsEventListener(this) } );

    GradebookUtil.appendSeperator( items );
    if ( GradeCenter.retentionPlugInActive && this.colDef.model.getUserCanPerformAllGradingActions() )
    {
      items.push( { key : "cmSendEmailMsg", onclick : cellController.onSendEmail.bindAsEventListener(cellController) } );
      GradebookUtil.appendSeperator( items );
    }
    if ( this.colDef.model.getUserHasFullGradebookAccess() ) {
      items.push( { key : "cmHideStudentMsg", onclick : this.onHideUser.bindAsEventListener(this) } );
    }

    if( GradeCenter.courseHasGoals )
    {
      GradebookUtil.appendSeperator( items );
      items.push( { key : "cmReportMsg", onclick : this.onReport.bindAsEventListener(this) } );
    }

    return items;
  },

  onShowAllRows : function()
  {
    this.colDef.model.restoreFromSingleStudentView();
  },

  onHideOtherStudents : function()
  {
    this.colDef.model.viewSingleStudentGrades( this.getUserId() );
  },

  onStudentStats : function()
  {
    this.colDef.model.viewStudentStats( this.getUserId() );
  },

  onReport : function()
  {
    this.colDef.model.runReport( this.getUserId() );
  },

  onAdaptiveReleaseUser : function()
  {
    this.colDef.model.gradebookService.viewAdaptiveRelease( this.getInstitutionUserId() );
  },

  onHideUser : function()
  {
    this.colDef.model.updateUserVisibility( this.getUserId(), false );
  }

};

Gradebook.AttemptInfo = Class.create();

Object.extend(Gradebook.AttemptInfo.prototype,
{

  initialize : function(gradeCel, attemptData)
  {
    this.gradeCel = gradeCel;
    this.id = attemptData.id;
    this.date = attemptData.date;
    this.score = attemptData.score;
    this.status = attemptData.status;
    this.exempt = attemptData.exempt;
    this.countsTowardGrade = attemptData.countsTowardGrade;
    if (attemptData.groupAttemptId)
    {
      this.groupAttemptId = attemptData.groupAttemptId;
      this.groupName = attemptData.groupName;
      this.override = attemptData.override;
      this.groupScore = attemptData.groupScore;
      this.groupStatus = attemptData.groupStatus;
    }
  },

  getScoreDisplayValue : function()
  {
    if (this.status)
    {
      var icon = '';
      if (this.status == "ip")
      {
        icon =  this.gradeCel.colDef.model.gridImages.attemptInProgress;
      }
      else if( this.status == 'nr' || ( this.gradeCel && this.gradeCel.data && this.gradeCel.data.nr && this.gradeCel.data.nr == "y") )
      {
        icon =  this.gradeCel.colDef.model.gridImages.needsReconcile;
      }
      else
      {
        icon = this.gradeCel.colDef.model.gridImages.needsGrading;
      }
      icon +=  this.getDoesNotCountTowardsGradeImg();
      return icon;
    }
    var primaryValue = this.gradeCel.colDef.getDisplayValue(this.score);
    var secondaryValue = this.gradeCel.colDef.getSecondaryDisplayValue(this.score);
    if (secondaryValue)
    {
      primaryValue += " (" + secondaryValue + ")";
    }
    primaryValue +=  this.getDoesNotCountTowardsGradeImg();
    return primaryValue;
  },

  getGroupScoreDisplayValue : function()
  {
    if (this.groupStatus)
    {
      var icon = '';
      if (this.groupStatus == "ip")
      {
        icon = this.gradeCel.colDef.model.gridImages.attemptInProgress;
      }
      icon +=  this.getDoesNotCountTowardsGradeImg();
    }
    var primaryValue = this.gradeCel.colDef.getDisplayValue(this.groupScore);
    var secondaryValue = this.gradeCel.colDef.getSecondaryDisplayValue(this.groupScore);
    if (secondaryValue)
    {
      primaryValue += " (" + secondaryValue + ")";
    }
    primaryValue +=  this.getDoesNotCountTowardsGradeImg();
    return primaryValue;
  },

  getDoesNotCountTowardsGradeImg : function()
  {
    if ( !this.countsTowardGrade )
    {
      return this.gradeCel.colDef.model.gridImages.doesNotCountTowardsGrade;
    }
    else
    {
      return '';
    }
  },

  getText : function()
  {
    var exemptIcon = "";
    if (this.exempt)
    {
      var altText = this.gradeCel.colDef.model.getMessage('exemptAttemptMsg');
      exemptIcon = "<img src='/images/ci/gradebook/exempt.gif' alt='" + altText + "' title='" + altText + "'>";
    }
    if (!this.groupAttemptId)
    {
      if (!Gradebook.GridCell.attemptTemplate)
      {
        Gradebook.GridCell.attemptTemplate = new Template(this.gradeCel.colDef.model.getMessage('attemptInfoMsg'));
      }
      return Gradebook.GridCell.attemptTemplate.evaluate(
      {
        date : this.date,
        score : this.getScoreDisplayValue(),
        exempt : exemptIcon
      });
    }
    if (!this.override)
    {
      if (!Gradebook.GridCell.groupAttemptTemplate)
      {
        Gradebook.GridCell.groupAttemptTemplate = new Template(this.gradeCel.colDef.model.getMessage('groupAttemptInfoMsg'));
      }
      return Gradebook.GridCell.groupAttemptTemplate.evaluate(
      {
        date : this.date,
        score : this.getScoreDisplayValue(),
        groupName : this.groupName,
        exempt : exemptIcon
      });
    }
    if (!Gradebook.GridCell.groupAttemptOverrideTemplate)
    {
      Gradebook.GridCell.groupAttemptOverrideTemplate = new Template(this.gradeCel.colDef.model.getMessage('groupAttemptInfoWithOverrideMsg'));
    }
    return Gradebook.GridCell.groupAttemptOverrideTemplate.evaluate(
    {
      date : this.date,
      score : this.getScoreDisplayValue(),
      groupName : this.groupName,
      groupScore : this.getGroupScoreDisplayValue(),
      exempt : exemptIcon
    });
  }

});
/**
 * Gradebook data grid
 *
 * PORTIONS OF THIS FILE ARE BASED ON RICO LIVEGRID 1.1.2
 *
 * Copyright 2005 Sabre Airline Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author "Bill Richard"
 * @version
 *
 *
 */

Gradebook.NumericSchema = Class.create();
Gradebook.NumericSchema.prototype =
{
  initialize : function(jsonObj, model)
  {
    this.model = model;
    Object.extend(this, jsonObj); // assign json properties to this object
  },

  getGradeDistribution : function(grades, points, stats)
  {
    return Gradebook.PercentageSchema.prototype.getGradeDistribution(grades, points, stats);
  },

  // called by ColDef.getCellValue to get value for spreadsheet
  getCellValue : function(gridCell)
  {
    return this.getDisplayValue( gridCell.getValue(), gridCell.getPointsPossible() );
  },

  // called by ColDef.getCellValue to get alt value for spreadsheet
  getAltValue : function(gridCell)
  {
    return this.getCellValue( gridCell );
  },

  // this is the value that appears in the input box when editing
  getEditValue : function(gridCell)
  {
    return this.getCellValue(gridCell);
  },

  getSortValue : function(gridCell)
  {
    return gridCell.getValue();
  },

  // called by: this.getCellValue to get value for spreadsheet or
  // by colDef.getDisplayValue when external pages need to convert a rawValue
  getDisplayValue : function(rawValue, points)
  {
    if (rawValue === null )
    {
     return '';
    }
    if ( rawValue == '-' || rawValue.length === 0 )
    {
      return rawValue;
    }

    return NumberFormatter.formatScoreTruncate( parseFloat( rawValue ) );
  },

  getRawValue : function(displayValue, colDef, isCalculated, pointsPossible)
  {
    return NumberFormatter.getDotFloat(displayValue);
  },

  validate : function(newValue, matchPartial)
  {
    if (!newValue || newValue == "0" || newValue == "-")
    {
      return null;
    }
    if (!GradebookUtil.isValidFloat( newValue ))
    {
      return GradebookUtil.getMessage('invalidNumberErrorMsg');
    }
    if ( GradebookUtil.isGradeValueTooBig( newValue ) )
    {
      return GradebookUtil.getMessage('gradeValueTooBigErrorMsg');
    }
    var val = '' +newValue;
    var decimal = (typeof LOCALE_SETTINGS === 'undefined' || LOCALE_SETTINGS.getString('number_format.decimal_point') === null ) ? '.' : LOCALE_SETTINGS.getString('number_format.decimal_point');
    var idx = val.indexOf( decimal );

    if (idx > -1 && (val.length - idx - 1) > gradebook_utils.GradebookSettings.MAX_DECIMAL_DIGITS_SCORE)
    {
      return GradebookUtil.getMessage('tooManyDecimalPlacesErrorMsg');
    }
    else
    {
      return null;
    }
  }
};

Gradebook.TextSchema = Class.create();
Gradebook.TextSchema.prototype =
{
  initialize : function(jsonObj, model)
  {
    this.model = model;
    Object.extend(this, jsonObj); // assign json properties to this object
},

getGradeDistribution : function(grades, points, stats)
{
  return null;
},

// this is the value that appears in the input box when editing
  getEditValue : function(gridCell)
  {
    return this.getCellValue(gridCell);
  },

  // called by ColDef.getCellValue to get value for spreadsheet
  getCellValue : function(gridCell)
  {
    return this.getDisplayValue(gridCell.getTextValue(), gridCell.getPointsPossible());
  },
  getAltValue : function(gridCell)
  {
    return this.getCellValue( gridCell );
  },

  getSortValue : function(gridCell)
  {
    return gridCell.getTextValue().toUpperCase();
  },

  // called by: this.getCellValue to get value for spreadsheet or
  // by colDef.getDisplayValue when external pages need to convert a rawValue
  getDisplayValue : function(rawValue, points)
  {
    return rawValue;
  },

  getRawValue : function(displayValue, colDef, isCalculated, pointsPossible)
  {
    return displayValue;
  },

  validate : function( newValue, matchPartial )
  {
    //Prevent submission of text that is longer than 32 characters to prevent a database error
    if (newValue.length > 32)
    {
      return GradebookUtil.getMessage('textValueTooLongErrorMsg');
    }

    return null;
  }

};

Gradebook.PercentageSchema = Class.create();
Gradebook.PercentageSchema.prototype =
{
  initialize : function(jsonObj, model)
  {
    this.model = model;
    Object.extend(this, jsonObj); // assign json properties to this object
  },

  // called by ColDef.getStats
  getGradeDistribution : function(grades, points, stats)
  {
    var i, len;
    var dist = [];
    var range = [];
    range.count = 0;
    range.text = GradebookUtil.getMessage('lessThanZeroMsg');
    dist.push(range);
    for (i = 0; i < 10; i++)
    {
      range = [];
      range.count = 0;
      range.low = (i * 10);
      range.high = (i * 10) + ((i < 9) ? 9 : 10);
      var args = {0:range.low, 1:range.high};
      range.text = GradebookUtil.getMessage('rangeIndicatorMsg', args);
      dist.push(range);
    }
    range = [];
    range.count = 0;
    range.text = GradebookUtil.getMessage('greaterThanHundredMsg');
    dist.push(range);
    for (i = 0, len = grades.length; i < len; i++)
    {
      var percent = (points) ? (parseFloat(grades[i]) / parseFloat(points) * 100.0) : parseFloat(grades[i]);
      if (percent == 100)
      {
        percent -= 0.1; // 100 should fall into 90-100 bin
      }
      var index = parseInt(percent / 10.0, 10) + 1;
      if (percent < 0)
      {
        index = 0;
      }
      if (percent > 100)
      {
        index = 11;
      }
      dist[index].count++;
    }
    dist.reverse();
    return dist;
  },

  // called by ColDef.getCellValue to get value for spreadsheet
  getCellValue : function(gridCell)
  {
    // for numeric grades(: Numeric & Percentage Schema), we always show only up to 2 digits below decimal (LRN-114002 & LRN-118435)
    var maxPrecision = 2;
    return this.getDisplayValue(gridCell.getValue(), gridCell.getPointsPossible(), maxPrecision);
  },
  // called by ColDef.getCellValue to get value for spreadsheet
  getAltValue : function(gridCell)
  {
    return this.getCellValue( gridCell );
  },


  // this is the value that appears in the input box when editing
  getEditValue : function(gridCell)
  {
    return this.getCellValue(gridCell);
  },

  getSortValue : function(gridCell)
  {
    return gridCell.getNormalizedValue();
  },

  // called by: this.getCellValue to get value for spreadsheet or
  // by colDef.getDisplayValue when external pages need to convert a rawValue
  getDisplayValue : function(rawValue, points)
  {
    if (parseFloat(points) === 0.0 || rawValue == '-' || rawValue.length === 0)
    {
      return rawValue;
    }

    // replicating the percent calculation done in: BaseGradingSchema.TYPE.Percent.getSchemaValue()
    // using javascript big decimal library:  http://mikemcl.github.io/big.js/
    Big.DP = 15;
    Big.RM = 0; // Truncate
    var bdPercent = ( new Big( rawValue ) ).times( new Big( "100" ) ).div( new Big( points ) );

    // Truncate for display before converting to a floating point number
    bdPercent = bdPercent.round( gradebook_utils.getNumberLocalizer().DEFAULT_SCORE_MAX_FRACTION_DIGITS, 0 );
    return NumberFormatter.formatScoreTruncate( parseFloat( bdPercent ) ) + '%';
  },

  getRawValue : function(displayValue, colDef, isCalculated, pointsPossible)
  {
    var points = gradebook_utils.getPointsForRawValue(colDef, isCalculated, pointsPossible);
    displayValue = displayValue.replace( '%', '' );
    displayValue = NumberFormatter.getDotFloat( displayValue );
    return ( parseFloat( displayValue ) * parseFloat( points ) ) / 100.0;
  },

  validate : function(newValue, matchPartial)
  {
    newValue = newValue.replace('%', '');
    if (!newValue || newValue == "0" || newValue == "-")
    {
      return null;
    }
    if (!GradebookUtil.isValidFloat( newValue ))
    {
      return GradebookUtil.getMessage('invalidNumberErrorMsg');
    }
    if ( GradebookUtil.isGradeValueTooBig( newValue ) )
    {
      return GradebookUtil.getMessage('gradeValueTooBigErrorMsg');
    }
    var val = '' +newValue;
    var decimal = (typeof LOCALE_SETTINGS === 'undefined' || LOCALE_SETTINGS.getString('number_format.decimal_point') === null ) ? '.' : LOCALE_SETTINGS.getString('number_format.decimal_point');
    var idx = val.indexOf( decimal );

    if (idx > -1 && (val.length - idx - 1) > 5)
    {
      return GradebookUtil.getMessage('tooManyDecimalPlacesErrorMsg');
    }
    else
    {
      return null;
    }
  }

};

Gradebook.CompleteIncompleteSchema = Class.create();
Gradebook.CompleteIncompleteSchema.prototype =
{
  initialize : function(jsonObj, model)
  {
    this.model = model;
    Object.extend(this, jsonObj); // assign json properties to this object
},

// called by ColDef.getStats
  getGradeDistribution : function(grades, points, stats)
  {
    var dist =
      [];
    var range =
      [];
    range.count = stats.qtyNull;
    range.text = GradebookUtil.getMessage('incompleteMsg');
    dist.push(range);
    range =
      [];
    range.count = grades.length;
    range.text = GradebookUtil.getMessage('completeMsg');
    dist.push(range);
    dist.reverse();
    return dist;
  },

  // called by ColDef.getCellValue to get value for spreadsheet
  getCellValue : function(gridCell)
  {
    return this.getDisplayValue(gridCell.getTextValue(), gridCell.getPointsPossible());
  },

  getAltValue : function(gridCell)
  {
    var rawValue = this.getCellValue(gridCell) + ""; //convert to string since we're checking the length
    if (rawValue != '-' && rawValue.length > 0)
    {
      return GradebookUtil.getMessage('completedMsg');
    }
    else
    {
      return '-';
    }
  },

  // this is the value that appears in the input box when editing
  getEditValue : function(gridCell)
  {
    return gridCell.getValue();
  },

  getSortValue : function(gridCell)
  {
    var tv = gridCell.getTextValue().toUpperCase();
    if (tv == '-')
    {
      return '-';
    }
    else
    {
      return gridCell.getValue();
    }
  },

  // called by: this.getCellValue to get value for spreadsheet or
  // by colDef.getDisplayValue when external pages need to convert a rawValue
  getDisplayValue : function(rawValue, points)
  {
	rawValue += ""; //convert to String since we're checking the length
    if (rawValue != '-' && rawValue.length > 0)
    {
      return '<img border="0" width="16" height="16" src="/images/ci/icons/checkmark_ia.gif" alt="' + GradebookUtil.getMessage('completedMsg') + '">';
    }
    else
    {
      return '-';
    }
  },

  getRawValue : function(displayValue, colDef, isCalculated, pointsPossible)
  {
    // LRN-136692 User can enter a numeric score, therefore need to do locale-aware parsing.
    return NumberFormatter.getDotFloat(displayValue);
  },

  validate : function(newValue, matchPartial)
  {
    if (!newValue || newValue == "0" || newValue == "-")
    {
      return null;
    }
    // todo: determine what is allowed. I.E. is "-" allowed?
    // allow empty string or number
    // return (newValue.length == 0 || parseFloat(newValue));
    if (!GradebookUtil.isValidFloat(newValue))
    {
      return GradebookUtil.getMessage('invalidNumberErrorMsg');
    }
    else
    {
      return null;
    }
  }
};

Gradebook.LetterSchema = Class.create();
Gradebook.LetterSchema.prototype =
{
  initialize : function(jsonObj, model)
  {
    this.model = model;
    Object.extend(this, jsonObj); // assign json properties to this object
},

// called by ColDef.getStats
  getGradeDistribution : function(grades, points, stats)
  {
    var dist = [];
    var symMap = [];
    this.symbols.each(function(s)
    {
      var range =
        [];
      range.count = 0;
      range.text = s.sym;
      symMap[s.sym] = dist.length;
      dist.push(range);
    });
    for ( var i = 0, len = grades.length; i < len; i++)
    {
      var val = this.getDisplayValue(grades[i], points);
      var index = symMap[val];
      if ( index >= 0 )
      {
        dist[index].count++;
      }
    }
    return dist;
  },

  // called by ColDef.getCellValue to get value for spreadsheet
  getCellValue : function(gridCell)
  {
    // Pass in the raw value, not the text value so we can convert it to the current grading schema text properly
    // (I.e. if you have a grading schema A/B/C and enter A then getTextValue will give you 'A' but then if you
    // change the grading schema to be FOO/FUM you will still see 'A' here if we use textValue whereas using the value
    // will use whatever A mapped to as a value and convert it to FOO/FUM as appropriate)
    return this.getDisplayValue(gridCell.getValue(), gridCell.getPointsPossible());
  },
  
  getAltValue : function(gridCell)
  {
    return this.getCellValue( gridCell );
  },

  // this is the value that appears in the input box when editing
  getEditValue : function(gridCell)
  {
    return this.getCellValue(gridCell);
  },

  getSortValue : function(gridCell)
  {
    return gridCell.getNormalizedValue();
  },

  // called by: this.getCellValue to get value for spreadsheet or
  // by colDef.getDisplayValue when external pages need to convert a rawValue
  getDisplayValue : function(rawValue, points)
  {

    if (parseFloat(points) === 0.0 || rawValue == '-' || rawValue.length === 0)
    {
      return rawValue;
    }
    if ( isNaN( rawValue ) )
    {
      // see if raw value is one of the symbols
      var matchingSymbol;
      rawValue = rawValue.toUpperCase();
      this.symbols.each(function(s)
      {
        if (rawValue == s.sym.toUpperCase())
        {
          matchingSymbol = s.sym;
          throw $break; // needed to get out of each loop
        }
      });
      if (matchingSymbol)
      {
        return matchingSymbol;
      }
      return rawValue;
    }
    
    var retVal = rawValue;
    // replicating the percent calculation done in: BaseGradingSchema.TYPE.Tabular.getSchemaValue()
    // using javascript big decimal library:  http://mikemcl.github.io/big.js/
    Big.DP = 15;
    Big.RM = 0; // Truncate
    var percent = parseFloat( ( new Big( rawValue ) ).times( new Big( "100" ) ).div( new Big( points ) ) );
    
    var sLen = this.symbols.size();
    // NOTE : grading schema symbols list should be ordered by the upperbound in the descending order
    // it has always been the case but if it ever changes, this logic will have to be updated accordingly.
    this.symbols.each(function(s, sIndex)
    {
      if (percent >= s.lb && percent <= s.ub)
      {
        retVal = s.sym;
        throw $break; // needed to get out of each loop
      }
      else if (0 === sIndex && percent > s.ub)
      { // the percent value is greater than the the uppermost bound, we will translate it to the symbol for the highest grade defined in the schema
        retVal = s.sym;
        throw $break; // needed to get out of each loop
      }
      else if (sLen - 1 === sIndex && percent < s.lb)
      { // the percent value is less than the the lowest bound, we will translate it to the symbol for the lowest grade defined in the schema
        retVal = s.sym;
        throw $break; // needed to get out of each loop
      }
    });
    return retVal;
  },
  
  getRawValue : function(displayValue, colDef, isCalculated, pointsPossible)
  {

    // What it SHOULD be doing is:
    // Column created with Letter as primary display and secondary display of % -
    // worth 10 points
    // Enter A - go to schema and determine that A = 95% use 95% to determine
    // score of 9.5 - store 9.5 and display A
    // Enter 9 - determine the 9 is 90% (item is out of 10) 90% is an A - store 9
    // and display A

    var points = gradebook_utils.getPointsForRawValue(colDef, isCalculated, pointsPossible);
    displayValue = '' + displayValue;
    displayValue = displayValue.replace('%', '');
    var score = displayValue.toUpperCase();

    var matchedSymbol = false;

    this.symbols.each(function(s)
    {
      if (score == s.sym.toUpperCase())
      {
        score = (parseFloat(s.abs) / 100.0) * points;
        matchedSymbol = true;
        throw $break; // needed to get out of each loop
      }
    });

    if( !matchedSymbol )
    {
      // LRN-63079 Didn't match any of the schema symbols, so assume that the input was a number that needs to be un-localized.
      score = NumberFormatter.getDotFloat( score );
    }

    return score;
  },

  validate : function(newValue, matchPartial)
  {
    if (!newValue || newValue == "0" || newValue == "-")
    {
      return null;
    }
    // allow numeric value for letter schemas too
    if (GradebookUtil.isValidFloat(newValue))
    {
      return null;
    }
    var retVal = GradebookUtil.getMessage('invalidLetterErrorMsg');
    newValue = newValue.toUpperCase();
    this.symbols.each(function(s)
    {
      if (newValue == s.sym.toUpperCase() || (matchPartial && s.sym.toUpperCase().startsWith(newValue)))
      {
        retVal = null;
        throw $break; // needed to get out of each loop
      }
    });
    return retVal;
  }
};
/**
 * Gradebook data grid
 *
 * PORTIONS OF THIS FILE ARE BASED ON RICO LIVEGRID 1.1.2
 *
 * Copyright 2005 Sabre Airline Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author "Bill Richard"
 * @version
 *
 *
 */

// Gradebook.GridModel -----------------------------------------------------
Gradebook.CustomView = Class.create();
Gradebook.CustomView.prototype =
{
  initialize : function(jsonObj, model)
  {
    this.model = model;
    Object.extend(this, jsonObj); // assign json properties to this object
  },

  // evaluate this custom view; determine userIds & itemIds for view
  // returns false if the formula cannot be evaluated, else true
  evaluate : function()
  {
    try
    {
      if (this.definition)
      {
        var ext = eval('({' + this.definition + '})');
        Object.extend(this, ext);
        this.definition = null;
      }
      this.userIds =
        [];
      this.colIds =
        [];
      this.aliasMap =
        [];
      for ( var i = 0, len = this.aliases.length; i < len; i++)
      {
        this.aliasMap[this.aliases[i].key] = this.aliases[i].val;
      }
      if (this.formula)
      {
        this._evaluateAdvanced();
        this._computeDisplayItems();
      }
      else if (this.searchType == 'status')
      {
        this._evaluateStatus();
      }
      else
      {
        this._evaluateBasic();
        this._computeDisplayItems();
      }
      return true;
    }
    catch (e)
    {
      var errorMsg = GradebookUtil.getMessage( 'custViewRenderErrorMsg', { name: this.name } );
      alert( errorMsg );
      return false;
    }
  },

  usesGroups : function()
  {
    for ( var i = 0, len = this.aliases.length; i < len; i++)
    {
      if (this.aliases[i].key.startsWith('gr'))
      {
        return true;
      }
    }
    return false;
  },

  getUserIds : function()
  {
    return this.userIds;
  },

  getDisplayItemIds : function()
  {
    return this.colIds;
  },

  _computeDisplayItems : function()
  {
    // map aliased ids to real ids
    if (this.display.ids)
    {
      this.display.unAliasedIds =
        [];
      for ( var i = 0, len = this.display.ids.length; i < len; i++)
      {
        var id = this.aliasMap[this.display.ids[i]];
        if (!id)
        {
          throw 'missing alias';
        }
        this.display.unAliasedIds.push(id);
      }
    }
    var colDefs = this.model.getColDefs(false, this.display.showhidden);
    var dispType = this.display.items.toUpperCase();
    if (dispType == "BYITEM")
    {
      this.colIds = this._getItemsById();
    }
    else if (dispType == "INCRI")
    { // in criteria
      this.colIds = this._getItemsInCriteria();
    }
    else if (dispType == "BYCAT")
    { // by category
      this.colIds = this._getItemsByCategoryId(colDefs);
    }
    else if (dispType == "BYGP")
    { // by grading period
      this.colIds = this._getItemsByGradingPeriodId(colDefs);
    }
    else if (dispType == "ALLITEM")
    {
      this.colIds = this._getAllItems(colDefs);
    }
    else if (dispType == "IVS")
    {
      this.colIds = this._getItemsByVisibilityToStudents(colDefs, true);
    }
    else if (dispType == "INVS")
    {
      this.colIds = this._getItemsByVisibilityToStudents(colDefs, false);
    }
    else if (dispType == "NOITEM")
    {
      this.colIds =
        [];
    }
  },

  _getItemsById : function()
  {
    return this.display.unAliasedIds;
  },

  _getItemsInCriteria : function()
  {
    var itemIds =
      [];
    // get items that are used in criteria; which are in aliases
    for ( var i = 0, len = this.aliases.length; i < len; i++)
    {
      if (this.aliases[i].key.startsWith('I_'))
      {
        itemIds.push(this.aliases[i].val);
      }
    }
    return itemIds;
  },

  _getItemsByCategoryId : function(colDefs)
  {
    var itemIds =
      [];
    // get items that have category id in display.ids
    for ( var i = 0, len = colDefs.length; i < len; i++)
    {
      if (this.display.unAliasedIds.indexOf(colDefs[i].catid) != -1)
      {
        itemIds.push(colDefs[i].id);
      }
    }
    return itemIds;
  },

  _getItemsByGradingPeriodId : function(colDefs)
  {
    var itemIds =
      [];
    // get items that have grading period id in display.ids
    for ( var i = 0, len = colDefs.length; i < len; i++)
    {
      if (this.display.unAliasedIds.indexOf(colDefs[i].gpid) != -1)
      {
        itemIds.push(colDefs[i].id);
      }
    }
    return itemIds;
  },

  _getItemsByVisibilityToStudents : function(colDefs, vis)
  {
    var itemIds =
      [];
    // get items that have grading period id in display.ids
    for ( var i = 0, len = colDefs.length; i < len; i++)
    {
      if (colDefs[i].vis == vis)
      {
        itemIds.push(colDefs[i].id);
      }
    }
    return itemIds;
  },

  _getAllItems : function(colDefs)
  {
    var itemIds =
      [];
    for ( var i = 0, len = colDefs.length; i < len; i++)
    {
      itemIds.push(colDefs[i].id);
    }
    return itemIds;
  },

  _evaluateStatus : function()
  {
    var i, len, id;
    if (this.students.userIds && this.students.userIds[0] == "all")
    {
      var showstuhidden = this.students.showstuhidden;
      var modelStudents = this.model.getStudents(showstuhidden);
      for (i = 0, len = modelStudents.length; i < len; i++)
      {
        this.userIds.push(modelStudents[i].id);
      }
    }
    else if (this.students.userIds)
    {
      var uids = this.students.userIds;
      for (i = 0, len = uids.length; i < len; i++)
      {
        id = this.aliasMap[uids[i]];
        if (!id)
        {
          throw 'missing alias';
        }
        this.userIds.push(id);
      }
    }
    else if (this.students.groupIds)
    {
      var groupIds =
        [];
      for (i = 0, len = this.students.groupIds.length; i < len; i++)
      {
        id = this.aliasMap[this.students.groupIds[i]];
        if (!id)
        {
          throw 'missing alias';
        }
        groupIds.push(id);
      }
      var getUserIdsByGroupIdsFunc = this.model._getUserIdsByGroupIds.bind(this.model);
      this.userIds = getUserIdsByGroupIdsFunc(groupIds);
    }
    else
    {
      throw 'no userIds or groupIds in smart view';
    }
    var colDefs = this.model.getColDefs(false, this.display.showhidden);
    this.colIds =
      [];
    var catid;
    if (this.model.categoryFilter)
    {
      var cf = this.model.categoryFilter;
      catid = cf.startsWith('c_') ? cf.substr(2, cf.length - 2) : cf;
    }
    else if (this.category == 'c_all')
    {
      catid = 'all';
    }
    else
    {
      catid = this.aliasMap[this.category];
    }
    for (i = 0, len = colDefs.length; i < len; i++)
    {
      if (colDefs[i].catid == catid || catid == "all" && colDefs[i].isGrade())
      {
        this.colIds.push(colDefs[i].id);
      }
    }

    var filterType;
    if (this.model.statusFilter)
    {
      var sf = this.model.statusFilter;
      filterType = sf.startsWith('stat_') ? sf.substr(5, sf.length - 5) : sf;
    }
    else
    {
      filterType = this.display.items;
    }
    if (filterType == "ALL")
    {
      return; // no filtering needed
    }
    if (this.colIds.length === 0)
    {
      this.userIds =
        [];
      return;
    }

    var rowFlags =
      [];
    var colFlags =
      [];
    var temp_userIds =
      [];
    var temp_colIds =
      [];
    var r, c, rlen, clen;

    for (r = 0, len = this.userIds.length; r < len; r++)
    {
      rowFlags.push(false);
    }
    for (c = 0, len = this.colIds.length; c < len; c++)
    {
      colFlags.push(false);
    }

    // evaluate filter to determine which user/col to include.
    for (r = 0, rlen = this.userIds.length; r < rlen; r++)
    {

      var row = this.model.getRowByUserId(this.userIds[r]);
      for (c = 0, clen = this.colIds.length; c < clen; c++)
      {

        var colIndex = this.model.colDefMap[this.colIds[c]];
        var colDef = this.model.colDefs[colIndex];
        var grade = this._getGrade(row, colDef);

        if (grade.passesFilter(filterType))
        {
          if (!rowFlags[r])
          {
            rowFlags[r] = true;
            temp_userIds.push(this.userIds[r]);
          }
          if (!colFlags[c])
          {
            colFlags[c] = true;
            temp_colIds.push(this.colIds[c]);
          }
        }
      }
    }
    this.userIds = temp_userIds;
    this.colIds = temp_colIds;
  },

  _getGrade : function(row, colDef)
  {
    var colIndex = this.model.colDefMap[colDef.id];
    var data = row[colIndex];
    if (!data.metaData)
    {
      data.metaData = row[0];
    }
    if (!data.colDef)
    {
      data.colDef = colDef;
    }
    if (!this.gridCell)
    {
      this.gridCell = new Gradebook.GridCell();
    }
    this.gridCell.setData(data);
    return this.gridCell;
  },

  _evaluateBasic : function()
  {
    var i, len;
    if (this.students.userIds && this.students.userIds[0] != "all")
    {
      var uids = this.students.userIds;
      for (i = 0, len = uids.length; i < len; i++)
      {
        var id = this.aliasMap[uids[i]];
        if (!id)
        {
          throw 'missing alias';
        }
        this.userIds.push(id);
      }
    }
    else
    { // all students
      var showstuhidden = this.students.showstuhidden;
      var modelStudents = this.model.getStudents(showstuhidden);
      for (i = 0, len = modelStudents.length; i < len; i++)
      {
        this.userIds.push(modelStudents[i].id);
      }
    }
  },

  _evaluateAdvanced : function()
  {
    var i, len;
    // lazily compute postfix formula & criteriaMap
    if (!this.postFixFormula)
    {
      this.postFixFormula = this.infix2postfix(this.formula);
    }
    if (!this.criteriaMap)
    {
      this.criteriaMap =
        [];
      for (i = 0, len = this.criteria.length; i < len; i++)
      {
        this.criteriaMap[this.criteria[i].fid] = i;
      }
    }
    // test each row and add to userIds if it passes formula
    var rows = this.model.rows;
    for (i = 0, len = rows.length; i < len; i++)
    {
      if (this._evaluateFormulaForRow(rows[i]))
      {
        this.userIds.push(rows[i][0].uid);
      }
    }
  },

  _evaluateFormulaForRow : function(row)
  {
    // only one criteria in formula
    if (this.postFixFormula.length == 1)
    {
      return this._evalCriteria(this.postFixFormula[0], row);
    }
    // evaluate postfix formula:
    // * push non-operators on stack
    // * when operators are encountered:
    // pop two operands off stack
    // evaluate operands (criteria)
    // apply operator to the two evaluated operands
    // store result on stack
    // * pop & return final result
    var stack =
      [];
    for ( var i = 0, len = this.postFixFormula.length; i < len; i++)
    {
      var tok = this.postFixFormula[i];
      switch (tok)
      {
        case "AND":
        case "OR":
          if (stack.length < 2)
          {
            throw (this.model.getMessage('custViewStackEmptyMsg') + tok);
          }
          var op2 = stack.pop();
          var op1 = stack.pop();
          var firstValue = op1;
          if (typeof (op1) == 'string')
          {
            firstValue = this._evalCriteria(op1, row);
          }
          var secondValue = op2;
          if (typeof (op2) == 'string')
          {
            secondValue = this._evalCriteria(op2, row);
          }
          if (tok == "AND")
          {
            stack.push((firstValue && secondValue));
          }
          else if (tok == "OR")
          {
            stack.push((firstValue || secondValue));
          }
          break;
        default:
          stack.push(tok);
          break;
      }
    }
    if (stack.length != 1)
    {
      throw this.model.getMessage('custViewUnableToEvaluateMsg');
    }
    else
    {
      return stack.pop();
    }
  },

  _getAliasOrId : function(id)
  {
    if (id.startsWith('I_') || id.startsWith('c_') || id.startsWith('gp_') || id.startsWith('gr_') || id.startsWith('st_'))
    {
      return this.aliasMap[id];
    }
    else
    {
      return id;
    }
  },

  _evalCriteria : function(fid, row)
  {
    // look up criteria by fid
    var crit = this.criteria[this.criteriaMap[fid]];
    var colId = this._getAliasOrId(crit.cid);
    if (!colId)
    {
      throw 'missing alias';
    }
    var colDefMap = this.model.colDefMap;
    var colIdx = colDefMap[colId];
    if (colId == 'SV' || colId == 'GM')
    {
      colIdx = 0;
    }
    if (colIdx === undefined || colIdx === null)
    {
      throw 'missing alias';
    }
    var colDef = this.model.colDefs[colIdx];
    var gridCell = this._getGrade(row, colDef);
    var evalFunc = this._getEvalCriteriaFunc(crit);
    return evalFunc(crit, gridCell);
  },

  _evalAvailableCriteria : function(crit, gridCell)
  {
    var avail = (gridCell.isAvailable()) ? "A" : "U";
    return crit.value == avail;
  },

  _evalStatusCriteria : function(crit, gridCell)
  {
    return gridCell.passesFilter(crit.value);
  },

  _evalStudentVisibleCriteria : function(crit, gridCell)
  {
    var avail = (gridCell.isHidden()) ? "H" : "V";
    return crit.value == avail;
  },

  _evalGroupMembershipCriteria : function(crit, gridCell)
  {
    // There may be 1 or more values passed. We allow multiple selection of Groups
    var result = (crit.cond == "eq") ? false : true;
    var groupNames = crit.value.split(",");
    for ( var i = 0, len = groupNames.length; i < len; i++)
    {
      var groupId = this.aliasMap[groupNames[i]];
      if (!groupId)
      {
        throw 'missing alias';
      }
      var userId = gridCell.getUserId();
      var inGroup = this._userIsInGroup(userId, groupId);
      result = ((crit.cond == "eq") ? result || inGroup : result && !inGroup);
    }
    return result;
  },

  _evalLastAccessedCriteria : function(crit, gridCell)
  {
    var cellVal = new Date(gridCell.getValue()).getTime();

    if (crit.cond == "eq")
    {
      var numMSecPerDay = 1000 * 60 * 60 * 24;
      var v1 = parseInt(cellVal / numMSecPerDay, 10);
      var v2 = parseInt(crit.value / numMSecPerDay, 10);
      return (v1 == v2);
    }
    else if (crit.cond == "be")
    {
      return (cellVal < crit.value);
    }
    else if (crit.cond == "af")
    {
      return (cellVal > crit.value);
    }
  },

  _defaultEvalCriteria : function(crit, gridCell)
  {
    var cellVal = gridCell.getValue();
    var critVal;
    var isSchemaCIC = gridCell.colDef.primarySchema instanceof Gradebook.CompleteIncompleteSchema;
    //the customView with Complete/Incomplete Schema takes null/empty grades as Incomplete
    // LRN-49079 cells with manually overridden grades are also considered in a graded status
    if ( !isSchemaCIC &&
         ( gridCell.attemptInProgress() || gridCell.needsGrading() ||
         ( gridCell.isGrade() && !gridCell.isGraded() ) || gridCell.isExempt() ) )
    {
      return false;
    }
    var operator = crit.cond;
    // '-' will end up NaN
    if ( crit.value != '-')
    {
      critVal = gridCell.colDef.getRawValue( crit.value, gridCell.colDef.isCalculated(), gridCell.getPointsPossible() );
    }
    else
    {
      critVal = '-';
    }
    if (this._isNumber( cellVal ) && this._isNumber( critVal ) && crit.ctype != 'st')
    {
      var dblCellVal = this._toNumber( cellVal );
      var dblCritVal = this._toNumber( critVal );
      var dblCritVal2 = crit.value2 ? this._toNumber( gridCell.colDef.getRawValue( crit.value2, gridCell.colDef.isCalculated(), gridCell.getPointsPossible() ) ) : 0;
      if (operator == "eq")
      {
        return (dblCellVal == dblCritVal);
      }
      else if (operator == "neq")
      {
        return (dblCellVal != dblCritVal);
      }
      else if (operator == "gt")
      {
        return (dblCellVal > dblCritVal);
      }
      else if (operator == "lt")
      {
        return (dblCellVal < dblCritVal);
      }
      else if (operator == "le")
      {
        return (dblCellVal <= dblCritVal);
      }
      else if (operator == "ge")
      {
        return (dblCellVal >= dblCritVal);
      }
      else if (operator == "bet")
      {
        //determine min and max rather than assuming dblCritVal is lower than dblCritVal is higher. This is especially important for Letter schema types as they are flipped.
        var min = Math.min(dblCritVal, dblCritVal2);
        var max = Math.max(dblCritVal, dblCritVal2);
        return ((min <= dblCellVal) && (dblCellVal <= max));
      }
    }
    else if ( typeof (critVal) == "string" )
    {
      var cellTextValue = gridCell.getTextValue();
      //if data.tv is not empty
      if ( cellTextValue != '-' && cellTextValue !== undefined && cellTextValue !== null &&
          typeof ( cellTextValue ) == "string")
      {
        // replace gridCell.getValue() with gridCell.getTextValue()
        cellVal = cellTextValue.toUpperCase();
      }
      else
      {
        // LRN-46192 gridCell.tv is undefined for username, lastname, firstname and studentid columns, so use gridCell.v instead
        cellVal = cellVal.toUpperCase();
      }
      critVal = critVal.toUpperCase();
      if (operator == "eq")
      {
        if ( isSchemaCIC )
        {
          var gradeNotEmpty = cellTextValue != '-' && cellTextValue.length > 0 ;
          cellVal= gradeNotEmpty ? "C" : "IC";
        }
        return (cellVal == critVal);
      }
      else if (operator == "neq")
      {
        return (cellVal != critVal);
      }
      else if (operator == "bw")
      {
        return (cellVal.startsWith(critVal));
      }
      else if (operator == "con")
      {
        return (cellVal.indexOf(critVal) != -1);
      }
    }
    else
    {
      throw (this.model.getMessage('custViewDataTypeMismatchMsg') + ' ' + crit.fid);
    }
  },

  _getEvalCriteriaFunc : function(crit)
  {
    if (!this.evalCriteriaFuncMap)
    {
      this.evalCriteriaFuncMap =
        [];
      this.evalCriteriaFuncMap.AV = this._evalAvailableCriteria.bind(this);
      this.evalCriteriaFuncMap.SV = this._evalStudentVisibleCriteria.bind(this);
      this.evalCriteriaFuncMap.LA = this._evalLastAccessedCriteria.bind(this);
      this.evalCriteriaFuncMap.GM = this._evalGroupMembershipCriteria.bind(this);
    }
    var func = this.evalCriteriaFuncMap[crit.cid];
    if (!func)
    {
      if (crit.cond == 'se' )
      {
        func = this._evalStatusCriteria.bind(this);
      }
      else
      {
        func = this._defaultEvalCriteria.bind(this);
      }
    }
    return func;
  },

  _userIsInGroup : function(userId, groupId)
  {
    //userId = Number(userId);
    var groups = this.model.groups;
    for ( var i = 0, len = groups.length; i < len; i++)
    {
      if (groups[i].id == groupId)
      {
        return (groups[i].uids.indexOf(userId) != -1);
      }
    }
    return false;
  },

  getValidationError : function(f, criteriaLst)
  {
    try
    {
      var postFix = this.infix2postfix(f, criteriaLst);
      return null;
    }
    catch (e)
    {
      return e;
    }
  },

  infix2postfix : function(formula, criteriaLst)
  {
    var f = formula;
    f = f.gsub(/\(/, ' ( '); // add spaces around parens
    f = f.gsub(/\)/, ' ) '); // add spaces around parens
    var a = $w(f); // split into array
    var stack =
      [];
    var out =
      [];
    var tok;
    for ( var i = 0, len = a.length; i < len; i++)
    {
      tok = a[i].toUpperCase();
      switch (tok)
      {
        case "AND":
        case "OR":
          while (this._isOperator(stack[stack.length - 1]))
          {
            out.push(stack.pop());
          }
          stack.push(tok.toUpperCase());
          break;
        case "(":
          stack.push(tok);
          break;
        case ")":
          var foundStart = false;
          while (stack.length > 0)
          {
            tok = stack.pop();
            if (tok == "(")
            {
              foundStart = true;
              break;
            }
            else
            {
              out.push(tok);
            }
          }
          if (stack.length === 0 && !foundStart)
          {
            throw (this.model.getMessage('custViewMismatchedParensMsg') + ' ' + this.name);
          }
          break;
        default:
          if (criteriaLst && criteriaLst.indexOf(tok) == -1)
          {
            throw this.model.getMessage('criteriaNotFoundMsg');
          }
          out.push(tok);
          break;
      }
    }
    while (stack.length > 0)
    {
      tok = stack.pop();
      if (tok == '(')
      {
        throw (this.model.getMessage('custViewMismatchedParensMsg') + ' ' + this.name);
      }
      out.push(tok);
    }
    return out;
  },

  _isOperator : function(s)
  {
    return (s == 'OR' || s == 'AND');
  },
  _isNumber : function(s)
  {
    return (isNaN(parseFloat(s)) ? false : true);
  },

  _toNumber : function(s)
  {
    if (typeof (s) == "number")
    {
      return s;
    }
    else
    {
      var n = parseFloat(s);
      return n.valueOf();
    }
  }

};

Gradebook.CustomView.getFullGC = function(model)
{
  var json =
  {};
  json.name = model.getMessage('fullGradeCenterMsg');
  json.id = 'fullGC';
  json.definition = "\"searchType\":\"status\",\"category\":\"c_all\",\"students\":{\"userIds\":[\"all\"],\"showstuhidden\":false}, \"display\":{ \"items\":\"ALL\",\"showhidden\":false}";
  json.aliases =
    [];
  return new Gradebook.CustomView(json, model);
};
