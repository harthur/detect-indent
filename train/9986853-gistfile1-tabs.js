<input id="titField" type="text" value="CCTitle One" size="100px">
<input id="sofField" type="text" value="ABC" size="100px">    

<select id="select" onchange='ChangeInput()'>
	<option value='{"CCTitle":"CCTitle One","SOF":"ABC"}'>CCTitle One | ABC</option>
	<option value='{"CCTitle":"CCTitle Two","SOF":"XYZ"}'>CCTitle Two | XYZ</option>
</select>

<script>
function ChangeInput()
{
	var val = JSON.parse(document.getElementById("select").value);
	document.getElementById("titField").value = val.CCTitle;
	document.getElementById("sofField").value = val.SOF;
}
</script>
//http://jsfiddle.net/uGHPM/57/