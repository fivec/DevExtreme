"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    devices = require("core/devices"),
    SchedulerNavigator = require("ui/scheduler/ui.scheduler.navigator"),
    fx = require("animation/fx"),
    dateLocalization = require("localization/date"),
    keyboardMock = require("../../helpers/keyboardMock.js");

require("common.css!");
require("generic_light.css!");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-navigator"></div>');
});
QUnit.module("Navigator", {
    beforeEach: function() {
        devices.current({ platform: "generic" });

        this.instance = $("#scheduler-navigator").dxSchedulerNavigator().dxSchedulerNavigator("instance");
        this.instance.notifyObserver = noop;
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Scheduler navigator should be initialized", function(assert) {
    assert.ok(this.instance instanceof SchedulerNavigator, "dxSchedulerNavigator was initialized");
});

QUnit.test("Scheduler navigator should have a right css class", function(assert) {
    var $element = this.instance.element();

    assert.ok($element.hasClass("dx-scheduler-navigator"), "dxSchedulerNavigator has 'dx-scheduler-navigator' css class");
});

QUnit.test("Scheduler navigator should contain the 'next' button", function(assert) {
    var $element = this.instance.element();

    var $button = $element.find(".dx-scheduler-navigator-next");

    assert.equal($button.length, 1, "Navigator 'next' is rendered");
    assert.ok($button.hasClass("dx-button"), "Navigator 'next' is dxButton");
    assert.equal($button.attr("aria-label"), "Next period", "Navigator 'next' button has right label");
});

QUnit.test("Scheduler navigator should contain the 'previous' button", function(assert) {
    var $element = this.instance.element();

    var $button = $element.find(".dx-scheduler-navigator-previous");

    assert.equal($button.length, 1, "Navigator 'previous' is rendered");
    assert.ok($button.hasClass("dx-button"), "Navigator 'previous' is dxButton");
    assert.equal($button.attr("aria-label"), "Previous period", "Navigator 'previous' button has right label");
});

QUnit.test("Scheduler navigator should contain the 'caption' button", function(assert) {
    var $element = this.instance.element();

    var $button = $element.find(".dx-scheduler-navigator-caption");

    assert.equal($button.length, 1, "Navigation 'caption' is rendered");
    assert.ok($button.hasClass("dx-button"), "Navigator 'caption' is dxButton");
});

QUnit.test("Click on 'next' button should notify observer", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-next");

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("date", new Date(2015, 1, 24));

    $($button).trigger("dxclick");

    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 1, 25), "Arguments are OK");
});

QUnit.test("Click on 'previous' button should notify observer", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-previous");

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("date", new Date(2015, 1, 24));

    $($button).trigger("dxclick");

    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 1, 23), "Arguments are OK");
});

QUnit.test("Next button: Offset for 'week' step should be 7 days", function(assert) {
    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option({ date: new Date(2015, 1, 24), step: "week" });

    $(this.instance.element().find(".dx-scheduler-navigator-next")).trigger("dxclick");

    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 2, 3), "Arguments are OK");
});

QUnit.test("Previous button: Offset for 'week' step should be 7 days", function(assert) {
    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option({ date: new Date(2015, 1, 24), step: "week" });

    $(this.instance.element().find(".dx-scheduler-navigator-previous")).trigger("dxclick");

    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 1, 17), "Arguments are OK");
});

QUnit.test("Next button: Offset for 'workWeek' step should be 7 days", function(assert) {
    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option({ date: new Date(2015, 1, 24), step: "workWeek" });

    $(this.instance.element().find(".dx-scheduler-navigator-next")).trigger("dxclick");

    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 2, 3), "Arguments are OK");
});

QUnit.test("Previous button: Offset for 'workWeek' step should be 7 days", function(assert) {
    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option({ date: new Date(2015, 1, 24), step: "workWeek" });

    $(this.instance.element().find(".dx-scheduler-navigator-previous")).trigger("dxclick");

    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 1, 17), "Arguments are OK");
});

QUnit.test("Next button: Offset for 'month' step should be 1 month", function(assert) {
    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option({ date: new Date(2015, 0, 24), step: "month" });

    $(this.instance.element().find(".dx-scheduler-navigator-next")).trigger("dxclick");

    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 1, 24), "Arguments are OK");
});

QUnit.test("Next button: last month dates should be handled correctly", function(assert) {
    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option({ date: new Date(2015, 0, 31), step: "month" });

    $(this.instance.element().find(".dx-scheduler-navigator-next")).trigger("dxclick");

    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 1, 28), "Date is set to last month date");
});

QUnit.test("Previous button: Offset for 'month' step should be 1 month", function(assert) {
    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option({ date: new Date(2015, 0, 24), step: "month" });

    $(this.instance.element().find(".dx-scheduler-navigator-previous")).trigger("dxclick");

    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2014, 11, 24), "Arguments are OK");
});

QUnit.test("Navigator should throw an error if step is undefined", function(assert) {
    var instance = this.instance;

    assert.throws(
        function() {
            instance.option({ date: new Date(2015, 0, 24), step: "year" });

            $(instance.element().find(".dx-scheduler-navigator-previous")).trigger("dxclick");
        },
        function(e) {
            return /E1033/.test(e.message);
        },
        "Exception messages should be correct"
    );
});

QUnit.test("Caption should be OK with default options", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(),
        caption = [dateLocalization.format(date, "day"), dateLocalization.format(date, "monthAndYear")].join(" ");

    assert.equal(button.option("text"), caption, "Caption is OK");
});

QUnit.test("Caption should be OK when step and date are changed", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2015, 0, 24),
        caption = "24 January 2015";

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);
    assert.equal(button.option("text"), caption, "Step is day: Caption is OK");

    var weekDateString = devices.real().generic ? "25 January 2015" : "25 Jan 2015";

    caption = "19-" + weekDateString;

    this.instance.option("step", "week");
    assert.equal(button.option("text"), caption, "Step is week: Caption is OK");

    weekDateString = devices.real().generic ? "23 January 2015" : "23 Jan 2015",
    caption = "19-" + weekDateString;

    this.instance.option("step", "workWeek");
    assert.equal(button.option("text"), caption, "Step is workWeek: Caption is OK");

    caption = dateLocalization.format(date, "monthandyear");
    this.instance.option("step", "month");
    assert.equal(button.option("text"), caption, "Step is month: Caption is OK");


    this.instance.option("step", "agenda");

    weekDateString = devices.real().generic ? "30 January 2015" : "30 Jan 2015";
    caption = "24-" + weekDateString;

    assert.equal(button.option("text"), caption, "Step is agenda: Caption is OK");
});

QUnit.test("Caption should be OK for workWeek view & firstDayOfWeek = 0", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2015, 0, 24);

    this.instance.option("firstDayOfWeek", 0);
    this.instance.option("date", date);

    var caption = devices.real().generic ? "19-23 January 2015" : "19-23 Jan 2015";

    this.instance.option("step", "workWeek");
    assert.equal(button.option("text"), caption, "Step is workWeek: Caption is OK");
});

QUnit.test("Click on 'next' button should notify observer, day with intervalCount", function(assert) {
    var $element = this.instance.element(),
        $nextButton = $element.find(".dx-scheduler-navigator-next"),
        date = new Date(2015, 4, 25);

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "day");

    $($nextButton).trigger("dxclick");
    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 4, 28), "Arguments are OK");
});

QUnit.test("Caption should be OK for Day with intervalCount", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2015, 4, 25),
        caption = "25-27 May 2015";

    this.instance.option("date", date);
    this.instance.option("intervalCount", 3);

    assert.equal(button.option("text"), caption, "Caption is OK");
});

QUnit.test("Caption should be OK for workWeek view with intervalCount", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2015, 4, 25),
        caption = "25 May-12 Jun 2015";

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "workWeek");

    assert.equal(button.option("text"), caption, "Caption is OK");
});

QUnit.test("Caption should be OK for week view with intervalCount", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2015, 4, 25),
        caption = "25 May-14 Jun 2015";

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "week");

    assert.equal(button.option("text"), caption, "Caption is OK");
});

QUnit.test("Caption should be OK for Month with intervalCount", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2017, 4, 25),
        caption = "Jun-Jul 2017";

    this.instance.option("date", date);
    this.instance.option("intervalCount", 2);
    this.instance.option("step", "month");

    assert.equal(button.option("text"), caption, "Caption is OK");
});

QUnit.test("Caption should be OK for Month with intervalCount for different years", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2017, 10, 25),
        caption = "Dec 2017-Feb 2018";

    this.instance.option("date", date);
    this.instance.option("intervalCount", 3);
    this.instance.option("step", "month");

    assert.equal(button.option("text"), caption, "Caption is OK");
});

QUnit.test("Click on 'next' button should notify observer, week with intervalCount", function(assert) {
    var $element = this.instance.element(),
        $nextButton = $element.find(".dx-scheduler-navigator-next"),
        date = new Date(2015, 4, 25);

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "week");

    $($nextButton).trigger("dxclick");
    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 5, 15), "Arguments are OK");
});

QUnit.test("Click on 'next' button should notify observer, workWeek with intervalCount", function(assert) {
    var $element = this.instance.element(),
        $nextButton = $element.find(".dx-scheduler-navigator-next"),
        date = new Date(2015, 4, 25);

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "workWeek");

    $($nextButton).trigger("dxclick");
    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 5, 15), "Arguments are OK");
});

QUnit.test("Click on 'previous' button should notify observer, week with intervalCount", function(assert) {
    var $element = this.instance.element(),
        $nextButton = $element.find(".dx-scheduler-navigator-previous"),
        date = new Date(2015, 4, 25);

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "week");

    $($nextButton).trigger("dxclick");
    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 4, 4), "Arguments are OK");
});

QUnit.test("Click on 'previous' button should notify observer, workWeek with intervalCount", function(assert) {
    var $element = this.instance.element(),
        $nextButton = $element.find(".dx-scheduler-navigator-previous"),
        date = new Date(2015, 4, 25);

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "workWeek");

    $($nextButton).trigger("dxclick");
    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 4, 4), "Arguments are OK");
});

QUnit.test("Click on 'next' button should notify observer, month with intervalCount", function(assert) {
    var $element = this.instance.element(),
        $nextButton = $element.find(".dx-scheduler-navigator-next"),
        date = new Date(2015, 4, 25);

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "month");

    $($nextButton).trigger("dxclick");
    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 8, 25), "Arguments are OK");
});

QUnit.test("Click on 'previous' button should notify observer, month with intervalCount", function(assert) {
    var $element = this.instance.element(),
        $nextButton = $element.find(".dx-scheduler-navigator-previous"),
        date = new Date(2015, 4, 25);

    var updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("date", date);
    this.instance.option("intervalCount", 3),
    this.instance.option("step", "month");

    $($nextButton).trigger("dxclick");
    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 2, 25), "Arguments are OK");
});

QUnit.test("Calendar popover should be shown on caption click", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption");

    $($button).trigger("dxclick");

    var $popover = $(".dx-popover");

    assert.equal($popover.length, 1, "Popover exists");
    assert.equal($popover.dxPopover("instance").option("visible"), true, "Popover is shown");
});

QUnit.test("Popover should contain calendar", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption");

    $($button).trigger("dxclick");
    var $calendar = $(".dx-popup-content>.dx-calendar");

    assert.equal($calendar.length, 1, "Popover contains calendar");
    assert.ok($calendar.hasClass("dx-scheduler-navigator-calendar"), "Calendar has a specific class");
});

QUnit.test("Calendar should have a right date", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption"),
        date = new Date(2015, 4, 15);

    this.instance.option("date", date);


    $($button).trigger("dxclick");
    var $calendar = $(".dx-popup-content>.dx-calendar");

    assert.deepEqual($calendar.dxCalendar("instance").option("value"), date, "Calendar have a right date");
});

QUnit.test("Calendar should have a right date after change navigator's date", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption"),
        date = new Date(2015, 4, 15);

    $($button).trigger("dxclick");

    this.instance.option("date", date);
    var $calendar = $(".dx-popup-content>.dx-calendar");

    assert.deepEqual($calendar.dxCalendar("instance").option("value"), date, "Calendar have a right date");
});

QUnit.test("Calendar should have a right firstDayOfWeek", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption");

    this.instance.option("firstDayOfWeek", 3);


    $($button).trigger("dxclick");
    var $calendar = $(".dx-popup-content>.dx-calendar");

    assert.deepEqual($calendar.dxCalendar("instance").option("firstDayOfWeek"), 3, "Calendar have a right firstDayOfWeek");
});

QUnit.test("Calendar valueChange should notify observer", function(assert) {
    var $button = this.instance.element().find(".dx-scheduler-navigator-caption"),
        updateSpy = sinon.spy(noop);
    this.instance.notifyObserver = updateSpy;

    this.instance.option("date", new Date(2015, 3, 15));

    $($button).trigger("dxclick");

    var $calendar = $(".dx-popup-content>.dx-calendar"),
        $cell = $calendar.find("td[data-value='2015/04/10']");

    $($cell).trigger("dxclick");

    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 3, 10), "Arguments are OK");

    assert.equal($(".dx-popover").dxPopover("instance").option("visible"), false, "popover is closed");
});

QUnit.test("Scheduler navigator should have specific duration setting for 'agenda' view", function(assert) {
    this.instance.option({
        step: "agenda"
    });

    this.instance.invoke = function(subject) {
        if(subject === "getAgendaDuration") {
            return 5;
        }
    };

    assert.equal(this.instance._getConfig().duration, 5, "duration");
});

QUnit.test("Caption should be OK for 'agenda' view if agendaDuration = 1", function(assert) {
    this.instance.invoke = function(subject) {
        if(subject === "getAgendaDuration") {
            return 1;
        }
    };

    this.instance.option({
        step: "agenda",
        date: new Date(2015, 0, 24)
    });

    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        caption = devices.real().generic ? "24 January 2015" : "24 Jan 2015";

    assert.equal(button.option("text"), caption, "Step is agenda: Caption is OK");
});

QUnit.test("Caption should be OK for 'agenda' view if agendaDuration = 0", function(assert) {
    this.instance.invoke = function(subject) {
        if(subject === "getAgendaDuration") {
            return "0";
        }
    };

    this.instance.option({
        step: "agenda",
        date: new Date(2015, 0, 24)
    });

    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        caption = devices.real().generic ? "24-30 January 2015" : "24-30 Jan 2015";

    assert.equal(button.option("text"), caption, "Step is agenda: Caption is OK");
});

QUnit.module("Navigator Min & Max Options", {
    beforeEach: function() {
        devices.current({ platform: "generic" });

        this.instance = $("#scheduler-navigator").dxSchedulerNavigator({
            firstDayOfWeek: 1,
            min: new Date(2015, 1, 3),
            max: new Date(2015, 1, 3),
            date: new Date(2015, 1, 3)
        }).dxSchedulerNavigator("instance");
        this.instance.notifyObserver = noop;

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("prev button should be disabled if min option is handled", function(assert) {
    var prev = this.instance.element().find(".dx-scheduler-navigator-previous").dxButton("instance");

    assert.ok(prev.option("disabled"), "button is disabled");

    this.instance.option("min", new Date(2015, 1, 1));
    assert.notOk(prev.option("disabled"), "button is not disabled");

    this.instance.option("min", new Date(2015, 1, 3));
    assert.ok(prev.option("disabled"), "button is disabled");
});

QUnit.test("next button should be disabled if max option is handled", function(assert) {
    var next = this.instance.element().find(".dx-scheduler-navigator-next").dxButton("instance");

    assert.ok(next.option("disabled"), "button is disabled");

    this.instance.option("max", new Date(2015, 1, 8));
    assert.notOk(next.option("disabled"), "button is not disabled");

    this.instance.option("max", new Date(2015, 1, 3));
    assert.ok(next.option("disabled"), "button is disabled");
});

QUnit.test("prev button should be disabled if min option is handled for week step", function(assert) {
    this.instance.option("step", "week");
    var prev = this.instance.element().find(".dx-scheduler-navigator-previous").dxButton("instance");

    assert.ok(prev.option("disabled"), "button is disabled");

    this.instance.option("min", new Date(2015, 0, 1));
    assert.notOk(prev.option("disabled"), "button is not disabled");

    this.instance.option("min", new Date(2015, 1, 3));
    assert.ok(prev.option("disabled"), "button is disabled");
});

QUnit.test("next button should be disabled if max option is handled for week step", function(assert) {
    this.instance.option("step", "week");
    var next = this.instance.element().find(".dx-scheduler-navigator-next").dxButton("instance");

    assert.ok(next.option("disabled"), "button is disabled");

    this.instance.option("max", new Date(2015, 1, 14));
    assert.notOk(next.option("disabled"), "button is not disabled");

    this.instance.option("max", new Date(2015, 1, 3));
    assert.ok(next.option("disabled"), "button is disabled");
});

QUnit.test("next button should be enabled if max option has same date and different month", function(assert) {
    this.instance.option("step", "day");
    var next = this.instance.element().find(".dx-scheduler-navigator-next").dxButton("instance");

    this.instance.option("max", new Date(2015, 2, 3));
    assert.notOk(next.option("disabled"), "button is not disabled");
});

QUnit.test("prev button should be disabled if min option is handled for month step", function(assert) {
    this.instance.option("step", "month");
    var prev = this.instance.element().find(".dx-scheduler-navigator-previous").dxButton("instance");

    assert.ok(prev.option("disabled"), "button is disabled");

    this.instance.option("min", new Date(2015, 0, 1));
    assert.notOk(prev.option("disabled"), "button is not disabled");

    this.instance.option("min", new Date(2015, 1, 3));
    assert.ok(prev.option("disabled"), "button is disabled");
});

QUnit.test("next button should be disabled if max option is handled for month step", function(assert) {
    this.instance.option("step", "month");
    var next = this.instance.element().find(".dx-scheduler-navigator-next").dxButton("instance");

    assert.ok(next.option("disabled"), "button is disabled");

    this.instance.option("max", new Date(2015, 2, 14));
    assert.notOk(next.option("disabled"), "button is not disabled");

    this.instance.option("max", new Date(2015, 1, 3));
    assert.ok(next.option("disabled"), "button is disabled");
});

QUnit.test("next button should be enabled if max option has same date and different year", function(assert) {
    this.instance.option("step", "month");
    var next = this.instance.element().find(".dx-scheduler-navigator-next").dxButton("instance");

    this.instance.option("max", new Date(2016, 1, 10));
    assert.notOk(next.option("disabled"), "button is not disabled");
});

QUnit.test("Min & Max options are passed to calendar", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption");

    $($button).trigger("dxclick");
    var $calendar = $(".dx-popup-content>.dx-calendar"),
        calendar = $calendar.dxCalendar("instance");

    assert.deepEqual(calendar.option("min"), new Date(2015, 1, 3), "Calendar have a right min");
    assert.deepEqual(calendar.option("max"), new Date(2015, 1, 3), "Calendar have a right max");

    this.instance.option("min", new Date(2015, 1, 1));
    assert.deepEqual(calendar.option("min"), new Date(2015, 1, 1), "Calendar have a right min");

    this.instance.option("max", new Date(2015, 1, 5));
    assert.deepEqual(calendar.option("max"), new Date(2015, 1, 5), "Calendar have a right max");
});

QUnit.test("Caption should be OK for workWeek view, if date = Sunday", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2016, 0, 10);

    this.instance.option("firstDayOfWeek", 0);
    this.instance.option("date", date);

    var caption = devices.real().generic ? "11-15 January 2016" : "11-15 Jan 2016";

    this.instance.option("step", "workWeek");
    assert.equal(button.option("text"), caption, "Step is workWeek: Caption is OK");
});

QUnit.test("Caption should be OK for workWeek view, if date = Sunday and firstDayOfWeek != 0", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2016, 0, 10);

    this.instance.option("firstDayOfWeek", 3);
    this.instance.option("date", date);

    var caption = devices.real().generic ? "6-12 January 2016" : "6-12 Jan 2016";

    this.instance.option("step", "workWeek");
    assert.equal(button.option("text"), caption, "Step is workWeek: Caption is OK");
});

QUnit.test("Caption should be OK for workWeek view, if date = Saturday & firstDayOfWeek = 6", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2016, 0, 9);

    this.instance.option("firstDayOfWeek", 6);
    this.instance.option("date", date);

    var caption = devices.real().generic ? "11-15 January 2016" : "11-15 Jan 2016";

    this.instance.option("step", "workWeek");
    assert.equal(button.option("text"), caption, "Step is workWeek: Caption is OK");
});

QUnit.test("Caption should be OK for workWeek view, if date = Sunday & firstDayOfWeek = 6", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2016, 0, 10);

    this.instance.option("firstDayOfWeek", 6);
    this.instance.option("date", date);

    var caption = devices.real().generic ? "11-15 January 2016" : "11-15 Jan 2016";

    this.instance.option("step", "workWeek");
    assert.equal(button.option("text"), caption, "Step is workWeek: Caption is OK");
});

QUnit.test("Caption should be OK for week view, if date = Sunday & firstDayOfWeek = 1", function(assert) {
    var $element = this.instance.element(),
        button = $element.find(".dx-scheduler-navigator-caption").dxButton("instance"),
        date = new Date(2015, 2, 1);

    this.instance.option("firstDayOfWeek", 1);
    this.instance.option("date", date);

    this.instance.option("step", "week");
    assert.equal(button.option("text"), "23 Feb-1 Mar 2015", "Step is week: Caption is OK");
});


QUnit.module("Navigator Keyboard Navigation", {
    beforeEach: function() {
        devices.current({ platform: "generic" });

        this.instance = $("#scheduler-navigator").dxSchedulerNavigator({
            focusStateEnabled: true,
            tabIndex: 1
        }).dxSchedulerNavigator("instance");
        this.instance.notifyObserver = noop;

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("focusStateEnabled should be passed to buttons", function(assert) {
    var $buttons = this.instance.element().find(".dx-button");

    $.each($buttons, function(_, button) {
        assert.equal($(button).dxButton("instance").option("focusStateEnabled"), true, "focusStateEnabled is correct");
    });

    this.instance.option("focusStateEnabled", false);

    $.each($buttons, function(_, button) {
        assert.equal($(button).dxButton("instance").option("focusStateEnabled"), false, "focusStateEnabled is correct");
    });
});

QUnit.test("tabIndex should be passed to buttons", function(assert) {
    var $element = this.instance.element(),
        $buttons = $element.find(".dx-button");


    assert.equal($element.attr("tabindex"), null, "element has no tabIndex");

    $.each($buttons, function(_, button) {
        assert.equal($(button).dxButton("instance").option("tabIndex"), 1, "tabIndex is correct");
    });

    this.instance.option("tabIndex", 2);

    assert.equal($element.attr("tabindex"), null, "element has no tabIndex");

    $.each($buttons, function(_, button) {
        assert.equal($(button).dxButton("instance").option("tabIndex"), 2, "tabIndex is correct");
    });
});

QUnit.test("caption should be integrated with calendar", function(assert) {
    this.instance.option("date", new Date(2015, 3, 15));

    var $caption = this.instance.element().find(".dx-scheduler-navigator-caption"),
        keyboard = keyboardMock($caption),
        updateSpy = sinon.spy(noop);

    this.instance.notifyObserver = updateSpy;

    $($caption).trigger("focusin");
    keyboard.keyDown("enter");
    keyboard.keyDown("down");
    keyboard.keyDown("enter");

    assert.ok(updateSpy.calledOnce, "Observer is notified");
    assert.deepEqual(updateSpy.getCall(0).args[0], "currentDateUpdated", "Correct method of observer is called");
    assert.deepEqual(updateSpy.getCall(0).args[1], new Date(2015, 3, 22), "Arguments are OK");
});

QUnit.test("calendar's popover should be hidden after 'tab' key press", function(assert) {
    this.instance.option("date", new Date(2015, 3, 15));

    var $caption = this.instance.element().find(".dx-scheduler-navigator-caption"),
        keyboard = keyboardMock($caption),
        popover = $(".dx-popover").dxPopover("instance");

    $($caption).trigger("focusin");
    keyboard.keyDown("enter");
    assert.equal(popover.option("visible"), true, "Popover is shown");
    keyboard.keyDown("tab");
    assert.equal(popover.option("visible"), false, "Popover is hidden");
});

QUnit.test("calendar should have right keyboard options", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption");

    $($button).trigger("dxclick");
    var $calendar = $(".dx-popup-content>.dx-calendar");

    assert.strictEqual($calendar.dxCalendar("option", "tabIndex"), null, "Calendar have a right tabIndex");
    assert.strictEqual($calendar.dxCalendar("option", "hasFocus")(), true, "Calendar have a right hasFocus fn");
});


QUnit.module("Mobile behavior", {
    beforeEach: function() {
        devices.current({ platform: "ios" });

        this.instance = $("#scheduler-navigator").dxSchedulerNavigator().dxSchedulerNavigator("instance");
        this.instance.notifyObserver = noop;
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Popup should be used on mobile devices", function(assert) {
    var $element = this.instance.element(),
        $button = $element.find(".dx-scheduler-navigator-caption");

    $($button).trigger("dxclick");

    var $popup = $(".dx-popup"),
        popup = $popup.dxPopup("instance");

    assert.ok(popup.option("fullScreen"), "Popup takes full screen");
    assert.deepEqual(popup.option("toolbarItems"), [{ shortcut: "cancel" }], "Cancel button exists");

});
