$(function() {
    $('#testForm1').submit(function(e) {
      const stock = $("#form1_stock").val()
      const like = $('#form1_like').prop('checked')
      $.ajax({
        url: `/api/stock-prices?stock=${stock}&like=${like}`,
        type: 'get',
        success: function(data) {
            $('#jsonResult').text(JSON.stringify(data));
        }
      });
      e.preventDefault();
      return false;
    });
    $('#testForm2').submit(function(e) {
      const stock1 = $("#form2_stock1").val()
      const stock2 = $("#form2_stock2").val()
      const like = $('#form2_like').prop('checked')
      $.ajax({
        url: `/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${like}`,
        type: 'get',
        success: function(data) {
            $('#jsonResult').text(JSON.stringify(data));
        }
      });
      e.preventDefault();
      return false;
    });
  });