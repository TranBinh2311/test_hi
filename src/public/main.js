const wifiElement = document.querySelector('#hanldeWifi');
const wifi = document.querySelector('#wifi');

const handleClick = () => {
  if (wifi.style.display === 'block') {
    wifi.style.display = 'none';
  } else wifi.style.display = 'block';
};

wifiElement.addEventListener('click', handleClick);

$('.toggle-chart-table').on('click', function () {
  if ($(this).is(':checked')) {
    $('.toggle-chart-table-item').hide();
    $(`#${$(this).attr('data-target')}`).show();
  }
});

$('.toggle-chart-table-2').on('click', function () {
  if ($(this).is(':checked')) {
    $('.toggle-chart-table-item-2').hide();
    $(`#${$(this).attr('data-target-2')}`).show();
  }
});

let item_display = 0;

$('.list .item').on('click', function () {
  // $(".list .item").removeClass("green").removeClass("active");

  if ($(this).css('background-color', '#05b362')) {
    $(this).find(".notifi").toggle();
    item_display++;
  }

  if (item_display >= 2) {
    $('.monitor-section').show();
    $('.cpu_chart_panel').show();
  } else if (item_display === 1) {
    $('#cpu_chart_panel2').hide();
    $('#cpu_chart_panel1').show();
    $('.monitor-section').show();
  } else {
    $('.monitor-section').hide();
    $('.cpu_chart_panel').hide();
  }
});

$('.opensection').on('click', function () {
  $(this).toggleClass('active');

  const element = $(this).attr('data-target');

  if ($(this).hasClass('active')) {
    $(`.${element}`).show().css('visibility', 'visible');
  } else {
    // $("." + element).css("visibility", "hidden");
  }
});
