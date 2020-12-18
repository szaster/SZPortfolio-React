/********************************************************************************
* globalGradeUtils
* Collection of functions that can be used on any grading page in any project
*********************************************************************************/
if ( !window.globalGradeUtils )
{
  var globalGradeUtils = {};
  
  /* On gaining focus clear the grade text box if the grade value is set to null('-')
  */
  globalGradeUtils.onFocusGradeField = function ( gradeField )
  {
    if ( gradeField.value === '-' )
    {
      gradeField.value = '';
    }
    gradeField.select();
  };
  
  /* On losing focus set grade to null('-') if the grade text box is left empty
  */
  globalGradeUtils.onBlurGradeField = function ( gradeField )
  {
    if ( gradeField.value.blank() )
    {
      gradeField.value = '-';
    }
  };

}
