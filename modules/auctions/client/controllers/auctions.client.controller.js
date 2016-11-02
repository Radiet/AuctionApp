(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$state', '$uibModal', 'auctionResolve', 'AuctionsService', 'Notification'];

  function AuctionsController ($scope, $state, $uibModal, auction, AuctionsService, Notification) {
    var vm = this;

    vm.save = save;
    vm.auction = auction;
    vm.auctionItems = AuctionsService.query();
    vm.openDetail = openDetail;

    function save(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
      //   return false;
      // }

      // Create a new article, or update the current instance
      vm.auction.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('auctions.index'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Auction save error!' });
      }
    }

    function openDetail (auction) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '/modules/auctions/client/views/modal-auction.client.view.html',
        size: 'sm',
        controller: 'AuctionModalController',
        controllerAs: 'vm',
        resolve: {
          auctionResolve: function () {
            return auction;
          }
        }
      });

      modalInstance.result.then(
        function (resp) {
          if (resp.status==='destroy') {
            var index = vm.auctionItems.indexOf(resp.auction);
            vm.auctionItems.splice(index, 1);
          }
        },
        function () {}
      );
    }

  }
}());
