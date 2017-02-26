# -*- coding: utf-8 -*-

from django.template.loader import get_template
from django import template
from django.http import HttpResponse
from django.shortcuts import render


def home_page(request):
	return render(request,'index.html')

